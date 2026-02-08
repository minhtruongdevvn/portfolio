/**
 * EventBus - Lightweight event bus for cross-state communication
 * Singleton pattern
 */

import type {
  EventBusInterface,
  EventData,
  EventHandler,
  EventLog,
  UnsubscribeFunction
} from '../types/index.js';

export class EventBus implements EventBusInterface {
  private listeners: Map<string, EventHandler<EventData>[]>;
  private eventLog: EventLog[];
  private readonly maxLogSize: number;

  constructor() {
    this.listeners = new Map();
    this.eventLog = [];
    this.maxLogSize = 100;
  }

  /**
   * Register event listener
   * @param {string} eventName - Event name
   * @param {EventHandler<T>} handler - Event handler
   * @returns {UnsubscribeFunction} Unsubscribe function
   */
  on<T extends EventData = EventData>(
    eventName: string,
    handler: EventHandler<T>
  ): UnsubscribeFunction {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    const handlers = this.listeners.get(eventName);
    handlers?.push(handler as EventHandler<EventData>);

    // Return unsubscribe function
    return (): void => this.off(eventName, handler);
  }

  /**
   * Remove event listener
   * @param {string} eventName - Event name
   * @param {EventHandler<T>} handler - Handler to remove
   */
  off<T extends EventData = EventData>(
    eventName: string,
    handler: EventHandler<T>
  ): void {
    if (!this.listeners.has(eventName)) return;

    const handlers = this.listeners.get(eventName);
    if (!handlers) return;

    const index = handlers.indexOf(handler as EventHandler<EventData>);

    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Emit event to all listeners
   * @param {string} eventName - Event name
   * @param {T} data - Event data
   */
  emit<T extends EventData = EventData>(eventName: string, data: T = {} as T): void {
    // Log event for debugging
    this.logEvent(eventName, data);

    if (!this.listeners.has(eventName)) return;

    const handlers = this.listeners.get(eventName);
    if (!handlers) return;

    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error handling event ${eventName}:`, error);
      }
    });
  }

  /**
   * Listen to event once, then auto-unsubscribe
   * @param {string} eventName - Event name
   * @param {EventHandler<T>} handler - Event handler
   * @returns {UnsubscribeFunction} Unsubscribe function
   */
  once<T extends EventData = EventData>(
    eventName: string,
    handler: EventHandler<T>
  ): UnsubscribeFunction {
    const wrappedHandler = (data: T): void => {
      handler(data);
      this.off(eventName, wrappedHandler);
    };

    return this.on(eventName, wrappedHandler);
  }

  /**
   * Clear all listeners for an event
   * @param {string} eventName - Event name
   */
  clearEvent(eventName: string): void {
    this.listeners.delete(eventName);
  }

  /**
   * Clear all listeners
   */
  clearAll(): void {
    this.listeners.clear();
  }

  /**
   * Get list of active event names
   * @returns {string[]} List of event names with listeners
   */
  getActiveEvents(): string[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Log event for debugging
   * @param {string} eventName - Event name
   * @param {EventData} data - Event data
   */
  private logEvent(eventName: string, data: EventData): void {
    const log: EventLog = {
      timestamp: Date.now(),
      event: eventName,
      data: data
    };

    this.eventLog.push(log);

    // Keep log size manageable
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }
  }

  /**
   * Get event log (for debugging)
   * @returns {EventLog[]} Event log
   */
  getEventLog(): EventLog[] {
    return [...this.eventLog];
  }

  /**
   * Get recent events
   * @param {number} count - Number of recent events to return
   * @returns {EventLog[]} Recent events
   */
  getRecentEvents(count: number = 10): EventLog[] {
    return this.eventLog.slice(-count);
  }
}

// Export singleton instance
export const eventBus: EventBus = new EventBus();
