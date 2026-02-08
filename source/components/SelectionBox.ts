/**
 * SelectionBox Component
 * Visual selection box for multi-selecting desktop icons
 */

import type { Bounds } from '../types/index.js';

export class SelectionBox {
  private element: HTMLElement | null;
  private isActive: boolean;
  private startX: number;
  private startY: number;
  private currentX: number;
  private currentY: number;

  constructor() {
    this.element = null;
    this.isActive = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
  }

  start(x: number, y: number): void {
    if (!this.element) {
      this.element = document.createElement("div");
      this.element.className = "selection-box";
      const desktop = document.getElementById("desktop");
      if (desktop) {
        desktop.appendChild(this.element);
      }
    }

    this.isActive = true;
    this.startX = x;
    this.startY = y;
    this.currentX = x;
    this.currentY = y;

    this.updatePosition();
    this.element.style.display = "block";
  }

  update(x: number, y: number): void {
    if (!this.isActive) return;

    this.currentX = x;
    this.currentY = y;
    this.updatePosition();
  }

  private updatePosition(): void {
    if (!this.element) return;

    const left = Math.min(this.startX, this.currentX);
    const top = Math.min(this.startY, this.currentY);
    const width = Math.abs(this.currentX - this.startX);
    const height = Math.abs(this.currentY - this.startY);

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
  }

  end(): void {
    this.isActive = false;
    if (this.element) {
      this.element.style.display = "none";
    }
  }

  /**
   * Get selection box bounds
   */
  getBounds(): Bounds {
    return {
      left: Math.min(this.startX, this.currentX),
      top: Math.min(this.startY, this.currentY),
      right: Math.max(this.startX, this.currentX),
      bottom: Math.max(this.startY, this.currentY),
    };
  }

  isSelecting(): boolean {
    return this.isActive;
  }

  destroy(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
