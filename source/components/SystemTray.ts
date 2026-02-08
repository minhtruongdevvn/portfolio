/**
 * SystemTray Component
 * System tray with clock and system icons
 */

import { ICONS } from '../config/assets.js';

export class SystemTray {
  public element: HTMLElement | null;
  private clockElement: HTMLElement | null;
  private clockInterval: ReturnType<typeof setInterval> | null;

  constructor() {
    this.element = null;
    this.clockElement = null;
    this.clockInterval = null;
  }

  /**
   * Render the system tray
   */
  render(): HTMLElement {
    this.element = document.createElement('div');
    this.element.className = 'system-tray';

    // Create icons section
    const iconsSection = document.createElement('div');
    iconsSection.className = 'system-tray__icons';

    // Add system tray icons
    const batteryIcon = this.createIcon(ICONS.battery, 'Battery: 80%');
    const networkIcon = this.createIcon(ICONS.network, 'Network');
    const volumeIcon = this.createIcon(ICONS.volume, 'Volume');

    iconsSection.appendChild(batteryIcon);
    iconsSection.appendChild(networkIcon);
    iconsSection.appendChild(volumeIcon);

    // Create clock
    this.clockElement = this.createClock();

    // Create show desktop button
    const showDesktopBtn = document.createElement('div');
    showDesktopBtn.className = 'system-tray__show-desktop';
    showDesktopBtn.title = 'Show desktop';
    showDesktopBtn.addEventListener('click', () => {
      console.log('Show desktop clicked');
    });

    this.element.appendChild(iconsSection);
    this.element.appendChild(this.clockElement);
    this.element.appendChild(showDesktopBtn);

    // Start clock
    this.startClock();

    return this.element;
  }

  /**
   * Create system tray icon
   */
  private createIcon(iconSrc: string, title: string): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'system-tray__icon-wrapper';

    const icon = document.createElement('img');
    icon.className = 'system-tray__icon';
    icon.src = iconSrc;
    icon.alt = title;

    // Create built-in tooltip (like taskbar apps)
    const tooltip = document.createElement('div');
    tooltip.className = 'system-tray__icon-tooltip';
    tooltip.textContent = title;

    wrapper.appendChild(icon);
    wrapper.appendChild(tooltip);

    return wrapper;
  }

  /**
   * Create clock element
   */
  private createClock(): HTMLElement {
    const clock = document.createElement('div');
    clock.className = 'system-tray__clock';
    clock.title = 'Click to open date and time settings';

    const timeElement = document.createElement('div');
    timeElement.className = 'system-tray__time';

    const dateElement = document.createElement('div');
    dateElement.className = 'system-tray__date';

    clock.appendChild(timeElement);
    clock.appendChild(dateElement);

    // Add click handler
    clock.addEventListener('click', () => {
      console.log('Clock clicked');
    });

    return clock;
  }

  /**
   * Start clock updates
   */
  private startClock(): void {
    this.updateClock();
    this.clockInterval = setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  /**
   * Update clock display
   */
  private updateClock(): void {
    if (!this.clockElement) return;

    const now = new Date();

    // Format time (12-hour format)
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const timeString = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    // Format date (MM/DD/YYYY)
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    const dateString = `${month}/${day}/${year}`;

    // Update display
    const timeElement = this.clockElement.querySelector('.system-tray__time');
    const dateElement = this.clockElement.querySelector('.system-tray__date');

    if (timeElement) timeElement.textContent = timeString;
    if (dateElement) dateElement.textContent = dateString;
  }

  /**
   * Stop clock updates
   */
  private stopClock(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  /**
   * Destroy system tray
   */
  destroy(): void {
    this.stopClock();
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
