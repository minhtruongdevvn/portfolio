/**
 * NotificationManager
 * Centralized manager for displaying notifications
 */

import { Notification } from '../components/Notification.js';
import type { NotificationConfig, NotificationType } from '../types/index.js';

export class NotificationManager {
  private container: HTMLElement | null;
  private notifications: Notification[];
  private maxNotifications: number;

  constructor() {
    this.container = null;
    this.notifications = [];
    this.maxNotifications = 5; // Maximum number of notifications shown at once
  }

  /**
   * Initialize the notification container
   */
  init(): void {
    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'notification-container';
      document.body.appendChild(this.container);
    }
  }

  /**
   * Show a notification
   * @param {string|NotificationConfig} messageOrConfig - Message string or config object
   * @param {NotificationType} [type='info'] - Type if first param is string
   * @param {number} [duration=3000] - Duration if first param is string
   * @returns {Notification} The notification instance
   */
  show(messageOrConfig: string | NotificationConfig, type: NotificationType = 'info', duration: number = 3000): Notification {
    // Ensure container exists
    if (!this.container) {
      this.init();
    }

    // Handle both string and object parameters
    const config: NotificationConfig = typeof messageOrConfig === 'string'
      ? { message: messageOrConfig, type, duration }
      : messageOrConfig;

    // Add close callback to track notifications
    const originalOnClose = config.onClose;
    config.onClose = (): void => {
      this.removeNotification(notification);
      if (originalOnClose) {
        originalOnClose();
      }
    };

    // Create and render notification
    const notification = new Notification(config);
    const element = notification.render();

    // Remove oldest notification if max limit reached
    if (this.notifications.length >= this.maxNotifications) {
      const oldest = this.notifications[0];
      if (oldest) {
        oldest.close();
      }
    }

    // Add to container and track
    if (this.container) {
      this.container.appendChild(element);
    }
    this.notifications.push(notification);

    return notification;
  }

  /**
   * Show a success notification
   * @param {string} message - The message to display
   * @param {number} [duration=3000] - Duration in ms
   */
  success(message: string, duration: number = 3000): Notification {
    return this.show({ message, type: 'success', duration });
  }

  /**
   * Show an error notification
   * @param {string} message - The message to display
   * @param {number} [duration=5000] - Duration in ms (longer for errors)
   */
  error(message: string, duration: number = 5000): Notification {
    return this.show({ message, type: 'error', duration });
  }

  /**
   * Show a warning notification
   * @param {string} message - The message to display
   * @param {number} [duration=4000] - Duration in ms
   */
  warning(message: string, duration: number = 4000): Notification {
    return this.show({ message, type: 'warning', duration });
  }

  /**
   * Show an info notification
   * @param {string} message - The message to display
   * @param {number} [duration=3000] - Duration in ms
   */
  info(message: string, duration: number = 3000): Notification {
    return this.show({ message, type: 'info', duration });
  }

  /**
   * Remove a notification from tracking
   * @param {Notification} notification
   */
  private removeNotification(notification: Notification): void {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications.forEach(notification => notification.close());
    this.notifications = [];
  }

  /**
   * Destroy the manager and all notifications
   */
  destroy(): void {
    this.clearAll();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
  }
}

// Export singleton instance
export const notify = new NotificationManager();
