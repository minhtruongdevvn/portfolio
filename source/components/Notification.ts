/**
 * Notification Component
 * Windows 7-style toast notification
 */

import type { NotificationConfig, NotificationType } from '../types/index.js';

export class Notification {
  private message: string;
  private type: NotificationType;
  private duration: number;
  private onClose?: () => void;
  private element: HTMLDivElement | null;
  private timeout: number | null;
  private isClosing: boolean;

  /**
   * @param config - Notification configuration
   */
  constructor(config: NotificationConfig) {
    this.message = config.message;
    this.type = config.type || 'info';
    this.duration = config.duration !== undefined ? config.duration : 3000;
    this.onClose = config.onClose;
    this.element = null;
    this.timeout = null;
    this.isClosing = false;
  }

  /**
   * Render the notification element
   */
  render(): HTMLDivElement {
    this.element = document.createElement('div');
    this.element.className = `notification notification--${this.type}`;

    // Icon based on type
    const icon = this.getIcon();

    // Create structure
    this.element.innerHTML = `
      <div class="notification__icon">${icon}</div>
      <div class="notification__content">
        <div class="notification__message">${this.escapeHtml(this.message)}</div>
      </div>
      <button class="notification__close" aria-label="Close">×</button>
    `;

    // Close button handler
    const closeBtn = this.element.querySelector('.notification__close') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => this.close());

    // Auto-dismiss if duration is set
    if (this.duration > 0) {
      this.timeout = setTimeout(() => this.close(), this.duration) as unknown as number;
    }

    // Pause auto-dismiss on hover
    this.element.addEventListener('mouseenter', () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
    });

    // Resume auto-dismiss on mouse leave
    this.element.addEventListener('mouseleave', () => {
      if (this.duration > 0 && !this.timeout && !this.isClosing) {
        this.timeout = setTimeout(() => this.close(), 2000) as unknown as number;
      }
    });

    return this.element;
  }

  /**
   * Get icon SVG based on notification type
   */
  private getIcon(): string {
    const icons: Record<NotificationType, string> = {
      success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" fill="#4CAF50" stroke="#fff" stroke-width="1"/>
        <path d="M6 10L9 13L14 7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      error: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" fill="#F44336" stroke="#fff" stroke-width="1"/>
        <path d="M7 7L13 13M13 7L7 13" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
      warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L18 17H2L10 2Z" fill="#FF9800" stroke="#fff" stroke-width="1"/>
        <path d="M10 8V11M10 14H10.01" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
      info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" fill="#2196F3" stroke="#fff" stroke-width="1"/>
        <path d="M10 10V14M10 7H10.01" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
    };

    return icons[this.type] || icons.info;
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Close the notification
   */
  close(): void {
    if (this.isClosing) return;
    this.isClosing = true;

    // Clear timeout if exists
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    // Add closing animation class
    if (this.element) {
      this.element.classList.add('notification--closing');

      // Remove from DOM after animation
      setTimeout(() => {
        if (this.element && this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
        if (this.onClose) {
          this.onClose();
        }
      }, 300); // Match CSS animation duration
    }
  }

  /**
   * Destroy the notification
   */
  destroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
