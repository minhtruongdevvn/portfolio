/**
 * DragState - Manages drag and drop operations
 * GLOBAL STATE - Manages drag operations across all icons
 */

import { BaseState } from './BaseState.js';
import { selectionState } from './SelectionState.js';
import type {
  EventBusInterface,
  DragStateData,
  Position,
  Bounds,
  UnsubscribeFunction
} from '../types/index.js';

export class DragState extends BaseState<DragStateData> {

  private draggedElement: HTMLElement | null;
  private iconOffsets: Map<string, Position>;
  private unsubscribeSelection: UnsubscribeFunction | null;

  constructor(eventBus: EventBusInterface) {
    super(eventBus);

    this.draggedElement = null;
    this.iconOffsets = new Map();
    this.unsubscribeSelection = null;
  }

  getInitialState(): DragStateData {
    return {
      isDragging: false,
      draggedIconIds: [],
      dragOffset: { x: 0, y: 0 }
    };
  }

  /**
   * Setup event listeners
   */
  protected setupEventListeners(): void {
    // Optional: listen for selection cleared during drag
    this.unsubscribeSelection = this.on('selection:cleared', () => {
      // Selection cleared during drag shouldn't happen normally
      // but we can handle edge cases here if needed
    });
  }

  /**
   * Teardown event listeners
   */
  protected teardownEventListeners(): void {
    if (this.unsubscribeSelection) {
      this.unsubscribeSelection();
      this.unsubscribeSelection = null;
    }
  }

  /**
   * Handle drag start
   * @param {HTMLElement} element - Dragged element
   * @param {string} iconId - Icon ID
   * @param {DragEvent} event - Drag event
   */
  handleDragStart(element: HTMLElement, iconId: string, event: DragEvent): void {
    this.draggedElement = element;

    // Calculate offset from mouse to top-left of element
    const rect = element.getBoundingClientRect();
    const dragOffset: Position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    // Check if dragging multiple selected icons
    const selectedIcons = selectionState.getSelectedIcons();
    let draggedIconIds: string[] = [];

    if (selectedIcons.some(icon => icon.id === iconId)) {
      // Dragging multiple selected icons
      draggedIconIds = selectedIcons.map(icon => icon.id);

      // Calculate offset for each selected icon
      selectedIcons.forEach(icon => {
        const iconRect = icon.element?.getBoundingClientRect();
        if (iconRect) {
          this.iconOffsets.set(icon.id, {
            x: event.clientX - iconRect.left,
            y: event.clientY - iconRect.top
          });
        }
        icon.element?.classList.add('desktop-icon--dragging');
      });
    } else {
      // Dragging single unselected icon
      draggedIconIds = [iconId];
      element.classList.add('desktop-icon--dragging');
    }

    this.setState({
      isDragging: true,
      draggedIconIds,
      dragOffset
    });

    this.emit('drag:started', {
      iconIds: draggedIconIds,
      position: { x: event.clientX, y: event.clientY }
    });

    // Set drag data
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', iconId);

      // Hide default drag image
      const dragImage = document.createElement('div');
      dragImage.style.opacity = '0';
      document.body.appendChild(dragImage);
      event.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  }

  /**
   * Handle drag
   * @param {DragEvent} event - Drag event
   */
  handleDrag(event: DragEvent): void {
    if (!this._state.isDragging || !this.draggedElement) return;

    // Ignore end-of-drag event with 0,0 coordinates
    if (event.clientX === 0 && event.clientY === 0) return;

    const { draggedIconIds } = this._state;

    if (draggedIconIds.length > 1) {
      // Multi-icon drag
      const selectedIcons = selectionState.getSelectedIcons();
      selectedIcons.forEach(icon => {
        const offset = this.iconOffsets.get(icon.id);
        if (offset && icon.element) {
          const newX = event.clientX - offset.x;
          const newY = event.clientY - offset.y;
          icon.element.style.left = `${newX}px`;
          icon.element.style.top = `${newY}px`;
        }
      });
    } else {
      // Single icon drag
      const newX = event.clientX - this._state.dragOffset.x;
      const newY = event.clientY - this._state.dragOffset.y;
      this.draggedElement.style.left = `${newX}px`;
      this.draggedElement.style.top = `${newY}px`;
    }

    this.emit('drag:moved', {
      position: { x: event.clientX, y: event.clientY }
    });
  }

  /**
   * Handle drag end
   * @param {string} iconId - Icon ID
   * @param {DragEvent} event - Drag event
   */
  handleDragEnd(_iconId: string, event: DragEvent): void {
    if (!this._state.isDragging || !this.draggedElement) return;

    const { draggedIconIds } = this._state;

    if (draggedIconIds.length > 1) {
      // Multi-icon drag end
      const selectedIcons = selectionState.getSelectedIcons();
      selectedIcons.forEach(icon => {
        icon.element?.classList.remove('desktop-icon--dragging');

        const offset = this.iconOffsets.get(icon.id);
        if (offset && icon.element) {
          let newX = event.clientX - offset.x;
          let newY = event.clientY - offset.y;

          // Boundary checking
          const bounds = this.calculateBounds(icon.element);
          newX = Math.max(0, Math.min(newX, bounds.maxX || 0));
          newY = Math.max(0, Math.min(newY, bounds.maxY || 0));

          // Update position
          icon.element.style.left = `${newX}px`;
          icon.element.style.top = `${newY}px`;
          icon.position = { x: newX, y: newY };
        }
      });

      // Clear icon offsets
      this.iconOffsets.clear();
    } else {
      // Single icon drag end
      this.draggedElement.classList.remove('desktop-icon--dragging');

      let newX = event.clientX - this._state.dragOffset.x;
      let newY = event.clientY - this._state.dragOffset.y;

      // Boundary checking
      const bounds = this.calculateBounds(this.draggedElement);
      newX = Math.max(0, Math.min(newX, bounds.maxX || 0));
      newY = Math.max(0, Math.min(newY, bounds.maxY || 0));

      // Update position
      this.draggedElement.style.left = `${newX}px`;
      this.draggedElement.style.top = `${newY}px`;
    }

    this.emit('drag:ended', {
      iconIds: draggedIconIds,
      position: { x: event.clientX, y: event.clientY }
    });

    // Reset drag state
    this.setState({
      isDragging: false,
      draggedIconIds: [],
      dragOffset: { x: 0, y: 0 }
    });

    this.draggedElement = null;
  }

  /**
   * Calculate bounds for element
   * @param {HTMLElement} element - Element to calculate bounds for
   * @returns {Bounds} Bounds object with maxX and maxY
   */
  private calculateBounds(element: HTMLElement): Bounds {
    const desktop = document.getElementById('desktop');
    if (!desktop) {
      return { left: 0, top: 0, right: 0, bottom: 0, maxX: 0, maxY: 0 };
    }

    const desktopRect = desktop.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return {
      left: 0,
      top: 0,
      right: desktopRect.width,
      bottom: desktopRect.height,
      maxX: desktopRect.width - elementRect.width,
      maxY: desktopRect.height - elementRect.height
    };
  }

  /**
   * Setup drag over handler for desktop
   */
  setupDesktopDragOver(): void {
    const desktop = document.getElementById('desktop');
    if (!desktop) return;

    desktop.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    });

    desktop.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault();
    });
  }
}
