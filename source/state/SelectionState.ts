/**
 * SelectionState - Manages icon selection
 * GLOBAL STATE - Used by multiple components
 */

import { BaseState } from './BaseState.js';
import { SelectionBox } from '../components/SelectionBox.js';
import type {
  EventBusInterface,
  SelectionStateData,
  DesktopIconInterface,
  Bounds
} from '../types/index.js';
import { eventBus } from './EventBus.js';

 class SelectionState extends BaseState<SelectionStateData> {
  private selectionBox: SelectionBox;
  private icons: DesktopIconInterface[];

  constructor(eventBus: EventBusInterface) {
    super(eventBus);
    this.selectionBox = new SelectionBox();
    this.icons = [];
  }

  getInitialState(): SelectionStateData {
    return {
      selectedIconIds: new Set<string>(),
      isSelecting: false
    };
  }

  /**
   * Set icons array for selection checking
   * @param {DesktopIconInterface[]} icons - Array of DesktopIcon instances
   */
  setIcons(icons: DesktopIconInterface[]): void {
    this.icons = icons;
  }

  /**
   * Start selection box
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  startSelection(x: number, y: number): void {
    this.setState({ isSelecting: true });
    this.selectionBox.start(x, y);
    this.emit('selection:started', { x, y });
  }

  /**
   * Update selection box
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  updateSelection(x: number, y: number): void {
    if (!this._state.isSelecting) return;

    this.selectionBox.update(x, y);
    this.updateSelectedIcons();
  }

  /**
   * End selection box
   */
  endSelection(): void {
    if (!this._state.isSelecting) return;

    this.setState({ isSelecting: false });
    this.updateSelectedIcons();
    this.selectionBox.end();

    this.emit('selection:ended', {
      selectedIconIds: Array.from(this._state.selectedIconIds)
    });
  }

  /**
   * Update which icons are selected based on selection box bounds
   */
  private updateSelectedIcons(): void {
    const bounds = this.selectionBox.getBounds();
    const newSelection = new Set<string>();

    this.icons.forEach(icon => {
      if (this.isIconInBounds(icon, bounds)) {
        newSelection.add(icon.id);
        icon.select();
      } else {
        icon.deselect();
      }
    });

    // Only update state and emit if selection changed
    if (!this.areSetsEqual(this._state.selectedIconIds, newSelection)) {
      this.setState({ selectedIconIds: newSelection });
      this.emit('selection:changed', {
        selectedIconIds: Array.from(newSelection)
      });
    }
  }

  /**
   * Select a specific icon
   * @param {string} iconId - Icon ID
   */
  selectIcon(iconId: string): void {
    const newSelection = new Set(this._state.selectedIconIds);
    newSelection.add(iconId);
    this.setState({ selectedIconIds: newSelection });

    // Update icon UI
    const icon = this.icons.find(i => i.id === iconId);
    if (icon) {
      icon.select();
    }

    this.emit('selection:changed', {
      selectedIconIds: Array.from(newSelection)
    });
  }

  /**
   * Deselect all icons
   */
  deselectAll(): void {
    this.icons.forEach(icon => icon.deselect());
    this.setState({ selectedIconIds: new Set<string>() });
    this.emit('selection:cleared');
  }

  /**
   * Get array of selected icon objects
   * @returns {DesktopIconInterface[]} Array of selected DesktopIcon instances
   */
  getSelectedIcons(): DesktopIconInterface[] {
    return this.icons.filter(icon =>
      this._state.selectedIconIds.has(icon.id)
    );
  }

  /**
   * Check if currently doing box selection
   * @returns {boolean}
   */
  isActivelySelecting(): boolean {
    return this._state.isSelecting;
  }

  /**
   * Check if icon is within selection bounds
   * @param {DesktopIconInterface} icon - DesktopIcon instance
   * @param {Bounds} bounds - Selection box bounds
   * @returns {boolean}
   */
  private isIconInBounds(icon: DesktopIconInterface, bounds: Bounds): boolean {
    const iconElement = icon.element;
    if (!iconElement) return false;

    const rect = iconElement.getBoundingClientRect();
    const desktop = document.getElementById('desktop');
    if (!desktop) return false;

    const desktopRect = desktop.getBoundingClientRect();

    // Convert to desktop-relative coordinates
    const iconLeft = rect.left - desktopRect.left;
    const iconTop = rect.top - desktopRect.top;
    const iconRight = iconLeft + rect.width;
    const iconBottom = iconTop + rect.height;

    // Check if icon overlaps with selection box
    return !(
      iconRight < bounds.left ||
      iconLeft > bounds.right ||
      iconBottom < bounds.top ||
      iconTop > bounds.bottom
    );
  }

  /**
   * Compare two Sets for equality
   * @param {Set<string>} set1 - First set
   * @param {Set<string>} set2 - Second set
   * @returns {boolean}
   */
  private areSetsEqual(set1: Set<string>, set2: Set<string>): boolean {
    if (set1.size !== set2.size) return false;
    for (const item of set1) {
      if (!set2.has(item)) return false;
    }
    return true;
  }

  /**
   * Destroy state and cleanup
   */
  destroy(): void {
    this.selectionBox.destroy();
    super.destroy();
  }
}

export const selectionState : SelectionState = new SelectionState(eventBus);
