/**
 * State Management - Central export file
 * Single import point for all state classes and event bus
 */

export { BaseState } from './BaseState.js';
export { EventBus, eventBus } from './EventBus.js';
export * from './SelectionState.js';
export { MenuState } from './MenuState.js';
export { DragState } from './DragState.js';
export { TouchState } from './TouchState.js';

// Re-export types for convenience
export type {
  EventBusInterface,
  EventData,
  EventHandler,
  UnsubscribeFunction,
  SelectionStateData,
  MenuStateData,
  DragStateData,
  StateInterface,
  StateObserver
} from '../types/index.js';
