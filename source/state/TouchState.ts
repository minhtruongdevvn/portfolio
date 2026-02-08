/**
 * TouchState - Handles touch events for mobile
 * LOCAL - Not global state, just a helper class
 * Does NOT extend BaseState
 */

import type { EventBusInterface, Position } from '../types/index.js';

export class TouchState {
  private eventBus: EventBusInterface | null;
  private touchStartPos: Position;
  private isTouching: boolean;
  private touchedElement: HTMLElement | null;
  private dragTimeout: ReturnType<typeof setTimeout> | null;

  constructor(eventBus: EventBusInterface | null = null) {
    this.eventBus = eventBus;
    this.touchStartPos = { x: 0, y: 0 };
    this.isTouching = false;
    this.touchedElement = null;
    this.dragTimeout = null;
  }

  /**
   * Setup touch handlers for an element
   * @param {HTMLElement} element - Element to add touch handlers to
   * @param {string} iconId - Icon ID
   */
  setupTouchHandlers(element: HTMLElement, iconId: string): void {
    element.addEventListener('touchstart', (e: TouchEvent) => {
      this.handleTouchStart(element, iconId, e);
    }, { passive: false });

    element.addEventListener('touchmove', (e: TouchEvent) => {
      this.handleTouchMove(element, e);
    }, { passive: false });

    element.addEventListener('touchend', (e: TouchEvent) => {
      this.handleTouchEnd(element, iconId, e);
    }, { passive: false });

    element.addEventListener('touchcancel', (e: TouchEvent) => {
      this.handleTouchEnd(element, iconId, e);
    }, { passive: false });
  }

  /**
   * Handle touch start
   * @param {HTMLElement} element - Touched element
   * @param {string} iconId - Icon ID
   * @param {TouchEvent} e - Touch event
   */
  private handleTouchStart(element: HTMLElement, iconId: string, e: TouchEvent): void {
    // Don't interfere with menu interactions
    if ((e.target as HTMLElement).closest('.dropdown-menu')) {
      return;
    }

    const touch = e.touches[0];
    if (!touch) return;

    this.touchStartPos = { x: touch.clientX, y: touch.clientY };
    this.isTouching = true;
    this.touchedElement = element;

    // Store initial position
    const rect = element.getBoundingClientRect();
    element.dataset.startX = rect.left.toString();
    element.dataset.startY = rect.top.toString();
    element.dataset.offsetX = (touch.clientX - rect.left).toString();
    element.dataset.offsetY = (touch.clientY - rect.top).toString();

    // Emit touch event if event bus available
    if (this.eventBus) {
      this.eventBus.emit('touch:started', {
        iconId,
        position: { x: touch.clientX, y: touch.clientY }
      });
    }

    // Add dragging class after a delay
    this.dragTimeout = setTimeout(() => {
      if (this.isTouching) {
        element.classList.add('desktop-icon--dragging');
        // Prevent scrolling while dragging
        e.preventDefault();
      }
    }, 100);
  }

  /**
   * Handle touch move
   * @param {HTMLElement} element - Touched element
   * @param {TouchEvent} e - Touch event
   */
  private handleTouchMove(element: HTMLElement, e: TouchEvent): void {
    if (!this.isTouching || !this.touchedElement) return;

    const touch = e.touches[0];
    if (!touch) return;

    const deltaX = Math.abs(touch.clientX - this.touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - this.touchStartPos.y);

    // If moved more than 10px, it's a drag
    if (deltaX > 10 || deltaY > 10) {
      e.preventDefault();

      const offsetX = parseFloat(element.dataset.offsetX || '0');
      const offsetY = parseFloat(element.dataset.offsetY || '0');

      const newX = touch.clientX - offsetX;
      const newY = touch.clientY - offsetY;

      // Update position
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;

      // Emit move event if event bus available
      if (this.eventBus) {
        this.eventBus.emit('touch:moved', {
          position: { x: touch.clientX, y: touch.clientY }
        });
      }
    }
  }

  /**
   * Handle touch end
   * @param {HTMLElement} element - Touched element
   * @param {string} iconId - Icon ID
   * @param {TouchEvent} e - Touch event
   */
  private handleTouchEnd(element: HTMLElement, iconId: string, _e: TouchEvent): void {
    if (this.dragTimeout) {
      clearTimeout(this.dragTimeout);
      this.dragTimeout = null;
    }

    if (!this.isTouching) return;

    const wasDragging = element.classList.contains('desktop-icon--dragging');
    element.classList.remove('desktop-icon--dragging');

    if (wasDragging) {
      // Perform boundary checking
      const rect = element.getBoundingClientRect();
      const desktop = document.getElementById('desktop');
      if (!desktop) return;

      const desktopRect = desktop.getBoundingClientRect();

      let newX = rect.left;
      let newY = rect.top;

      // Boundary checking
      const maxX = desktopRect.width - rect.width;
      const maxY = desktopRect.height - rect.height;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;

      // Emit end event if event bus available
      if (this.eventBus) {
        this.eventBus.emit('touch:ended', {
          iconId,
          position: { x: newX, y: newY }
        });
      }
    }

    this.isTouching = false;
    this.touchedElement = null;
  }

  /**
   * Check if device is touch-enabled
   * @returns {boolean}
   */
  static isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      ((navigator as Navigator & { msMaxTouchPoints?: number }).msMaxTouchPoints ?? 0) > 0
    );
  }
}
