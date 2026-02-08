/**
 * BaseState - Abstract base class for all state managers
 * Provides Observer pattern and event bus capabilities
 */

import type {
  EventBusInterface,
  EventData,
  EventHandler,
  StateObserver,
  UnsubscribeFunction
} from '../types/index.js';

export abstract class BaseState<T extends object> {
  protected eventBus: EventBusInterface | null;
  protected observers: StateObserver<T>[];
  protected _state: T;
  protected _isInitialized: boolean;

  constructor(eventBus: EventBusInterface | null = null) {
    this.eventBus = eventBus;
    this.observers = [];
    this._state = this.getInitialState();
    this._isInitialized = false;
  }

  /**
   * Get initial state structure
   * Must be implemented by subclasses
   * @returns {T} Initial state object
   */
  abstract getInitialState(): T;

  /**
   * Initialize the state
   * Sets up event listeners
   */
  init(): void {
    if (this._isInitialized) return;
    this.setupEventListeners();
    this._isInitialized = true;
  }

  /**
   * Destroy the state
   * Cleans up event listeners and resets state
   */
  destroy(): void {
    this.teardownEventListeners();
    this.observers = [];
    this._state = this.getInitialState();
    this._isInitialized = false;
  }

  /**
   * Setup event listeners
   * Override in subclass to listen to events
   */
  protected setupEventListeners(): void {
    // Override in subclass
  }

  /**
   * Teardown event listeners
   * Override in subclass to cleanup listeners
   */
  protected teardownEventListeners(): void {
    // Override in subclass
  }

  /**
   * Get current state (immutable copy)
   * @returns {T} Copy of current state
   */
  getState(): T {
    return { ...this._state };
  }

  /**
   * Update state and notify observers
   * @param {Partial<T>} updates - Object with state updates
   */
  setState(updates: Partial<T>): void {
    const oldState = { ...this._state };
    this._state = { ...this._state, ...updates };
    this.notifyObservers(oldState, this._state);
  }

  /**
   * Subscribe to state changes (Observer pattern)
   * @param {StateObserver<T>} callback - Function called on state changes
   * @returns {UnsubscribeFunction} Unsubscribe function
   */
  subscribe(callback: StateObserver<T>): UnsubscribeFunction {
    this.observers.push(callback);

    // Return unsubscribe function
    return (): void => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all observers of state changes
   * @param {T} oldState - Previous state
   * @param {T} newState - New state
   */
  protected notifyObservers(oldState: T, newState: T): void {
    this.observers.forEach(callback => {
      try {
        callback(newState, oldState);
      } catch (error) {
        console.error('Error in state observer:', error);
      }
    });
  }

  /**
   * Emit event via event bus
   * @param {string} eventName - Name of event
   * @param {EventData} data - Event data
   */
  protected emit(eventName: string, data: EventData = {}): void {
    if (!this.eventBus) {
      console.warn(`No event bus configured for ${this.constructor.name}`);
      return;
    }

    this.eventBus.emit(eventName, {
      source: this.constructor.name,
      ...data
    });
  }

  /**
   * Listen to event from event bus
   * @param {string} eventName - Name of event
   * @param {EventHandler<E>} handler - Event handler
   * @returns {UnsubscribeFunction} Unsubscribe function
   */
  protected on<E extends EventData = EventData>(
    eventName: string,
    handler: EventHandler<E>
  ): UnsubscribeFunction {
    if (!this.eventBus) {
      console.warn(`No event bus configured for ${this.constructor.name}`);
      return (): void => {};
    }

    return this.eventBus.on(eventName, handler);
  }

  /**
   * Remove event listener
   * @param {string} eventName - Name of event
   * @param {EventHandler<E>} handler - Event handler to remove
   */
  protected off<E extends EventData = EventData>(
    eventName: string,
    handler: EventHandler<E>
  ): void {
    if (this.eventBus) {
      this.eventBus.off(eventName, handler);
    }
  }
}
