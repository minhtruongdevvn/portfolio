/**
 * StartButton Component
 * Windows 7 Start button
 */

import { ICONS } from '../config/assets.js';

export class StartButton {
  private element: HTMLButtonElement | null;

  constructor() {
    this.element = null;
  }

  /**
   * Render the start button
   */
  render(): HTMLButtonElement {
    this.element = document.createElement('button');
    this.element.className = 'start-button';

    // Try to load Windows logo icon
    const icon = document.createElement('img');
    icon.className = 'start-button__icon';
    icon.src = ICONS.windowsLogo;
    icon.alt = 'Start';

    // If icon fails to load, show placeholder
    icon.onerror = () => {
      icon.remove();
      const placeholder = document.createElement('div');
      placeholder.className = 'start-button__placeholder';
      placeholder.textContent = '';
      this.element!.appendChild(placeholder);
    };

    this.element.appendChild(icon);

    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'start-button__tooltip';
    tooltip.textContent = 'Start';
    this.element.appendChild(tooltip);

    // Setup event listeners
    this.setupEventListeners();

    return this.element;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    this.element!.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Handle click event
   */
  private handleClick(e: MouseEvent): void {
    e.stopPropagation();
    console.log('Start button clicked');
    // Future: Open Start menu
  }
}
