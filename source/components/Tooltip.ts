/**
 * Tooltip Component
 * Reusable tooltip for desktop icons and system tray
 */

import type { TooltipOptions, TooltipPosition } from '../types/index.js';

export class Tooltip {
  private element: HTMLDivElement | null;
  private hideTimeout: number | null;
  private showTimeout: number | null;

  constructor() {
    this.element = null;
    this.hideTimeout = null;
    this.showTimeout = null;
  }

  /**
   * Create tooltip element if it doesn't exist
   */
  createTooltip(): HTMLDivElement {
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.className = 'tooltip';
      document.body.appendChild(this.element);
    }
    return this.element;
  }

  /**
   * Show tooltip at specific position
   */
  show(text: string, targetElement: HTMLElement, options: TooltipOptions = {}): void {
    const tooltip = this.createTooltip();
    tooltip.textContent = text;

    // Clear any timeouts
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    // Position tooltip relative to target
    const rect = targetElement.getBoundingClientRect();
    const position: TooltipPosition = options.position || 'bottom';
    const offset = options.offset || 8;

    let left: number, top: number;

    switch (position) {
      case 'top':
        left = rect.left + rect.width / 2;
        top = rect.top - offset;
        tooltip.style.transform = 'translate(-50%, -100%)';
        break;
      case 'bottom':
        left = rect.left + rect.width / 2;
        top = rect.bottom + offset;
        tooltip.style.transform = 'translate(-50%, 0)';
        break;
      case 'left':
        left = rect.left - offset;
        top = rect.top + rect.height / 2;
        tooltip.style.transform = 'translate(-100%, -50%)';
        break;
      case 'right':
        left = rect.right + offset;
        top = rect.top + rect.height / 2;
        tooltip.style.transform = 'translate(0, -50%)';
        break;
      default:
        left = rect.left + rect.width / 2;
        top = rect.bottom + offset;
        tooltip.style.transform = 'translate(-50%, 0)';
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    // Show tooltip
    tooltip.classList.add('tooltip--visible');
  }

  /**
   * Hide tooltip immediately
   */
  hide(): void {
    // Clear any pending show timeout
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    // Clear any hide timeout
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    // Hide immediately
    if (this.element) {
      this.element.classList.remove('tooltip--visible');
    }
  }

  /**
   * Setup tooltip for an element
   */
  static setupTooltip(element: HTMLElement, text: string, options: TooltipOptions = {}): Tooltip | null {
    // Skip tooltips on touch devices
    if ('ontouchstart' in window) {
      return null;
    }

    const tooltip = new Tooltip();
    let isHovering = false;

    element.addEventListener('mouseenter', () => {
      isHovering = true;

      // Clear any existing timeouts
      if (tooltip.showTimeout) {
        clearTimeout(tooltip.showTimeout);
      }

      // Show tooltip after delay
      tooltip.showTimeout = setTimeout(() => {
        if (isHovering) {
          tooltip.show(text, element, options);
        }
      }, options.delay || 500) as unknown as number;
    });

    element.addEventListener('mouseleave', () => {
      isHovering = false;

      // Clear show timeout if not yet shown
      if (tooltip.showTimeout) {
        clearTimeout(tooltip.showTimeout);
        tooltip.showTimeout = null;
      }

      // Hide immediately
      tooltip.hide();
    });

    return tooltip;
  }

  /**
   * Destroy tooltip
   */
  destroy(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
