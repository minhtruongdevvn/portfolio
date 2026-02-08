/**
 * Type definitions for Desktop Simulator
 * Centralized type definitions for the entire application
 */

// ============================================================================
// Core Types
// ============================================================================

export interface Position {
  x: number;
  y: number;
}

export interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  maxX?: number;
  maxY?: number;
}

// ============================================================================
// Event Types
// ============================================================================

export interface EventData {
  source?: string;
  [key: string]: unknown;
}

export interface IconEventData extends EventData {
  iconId?: string;
}

export interface SelectionEventData extends EventData {
  x?: number;
  y?: number;
  selectedIconIds?: string[];
}

export interface MenuEventData extends EventData {
  iconId?: string;
  position?: Position;
  item?: MenuItem;
}

export interface DragEventData extends EventData {
  iconIds?: string[];
  position?: Position;
}

export interface TouchEventData extends EventData {
  iconId?: string;
  position?: Position;
}

export interface WindowEventData extends EventData {
  windowId?: string;
  appId?: string;
  active?: boolean;
}

export interface TaskbarEventData extends EventData {
  id?: string;
  name?: string;
  icon?: string;
  pinned?: boolean;
  running?: boolean;
  active?: boolean;
  appId?: string;
}

export type EventHandler<T extends EventData = EventData> = (data: T) => void;

export type UnsubscribeFunction = () => void;

// ============================================================================
// State Types
// ============================================================================

export interface SelectionStateData {
  selectedIconIds: Set<string>;
  isSelecting: boolean;
}

export interface MenuStateData {
  activeMenuId: string | null;
  menuPosition: Position | null;
}

export interface DragStateData {
  isDragging: boolean;
  draggedIconIds: string[];
  dragOffset: Position;
}

// ============================================================================
// Observer Pattern
// ============================================================================

export type StateObserver<T> = (newState: T, oldState: T) => void;

// ============================================================================
// Component Types
// ============================================================================

export interface FileItem {
  name: string;
  type: "folder" | "file" | "iframe";
  contentType?: "iframe" | "text";
  url?: string;
  text?: string;
  items?: FileItem[];
}

export interface IconConfig {
  id: string;
  name: string;
  icon: string;
  position?: Position | { y: number };
  column?: "left" | "middle" | "right";
  menuItems?: MenuItemConfig[];
  contentType?: "folder" | "iframe" | "text";
  contentData?: {
    items?: FileItem[];
    url?: string;
    text?: string;
  };
}

export interface TaskbarAppConfig {
  id: string;
  name: string;
  icon: string;
  pinned?: boolean;
  running?: boolean;
  active?: boolean;
}

export interface MenuItem {
  label: string;
  icon?: string;
  action: string;
  separator?: boolean;
  disabled?: boolean;
}

export type MenuItemConfig =
  | {
      id: string;
      label: string;
      action: string;
      type?: never;
      disabled?: boolean;
    }
  | {
      type: "separator";
      id?: never;
      label?: never;
      action?: never;
      disabled?: never;
    };

export interface DesktopIconInterface {
  id: string;
  name: string;
  icon: string;
  position: Position;
  element: HTMLElement | null;
  isSelected: boolean;

  render(): HTMLElement;
  select(): void;
  deselect(): void;
  setPosition(x: number, y: number): void;
  getPosition(): Position;
  destroy(): void;
}

// ============================================================================
// EventBus Types
// ============================================================================

export interface EventLog {
  timestamp: number;
  event: string;
  data: EventData;
}

export interface EventBusInterface {
  on<T extends EventData = EventData>(
    eventName: string,
    handler: EventHandler<T>,
  ): UnsubscribeFunction;
  off<T extends EventData = EventData>(
    eventName: string,
    handler: EventHandler<T>,
  ): void;
  emit<T extends EventData = EventData>(eventName: string, data?: T): void;
  once<T extends EventData = EventData>(
    eventName: string,
    handler: EventHandler<T>,
  ): UnsubscribeFunction;
  clearEvent(eventName: string): void;
  clearAll(): void;
  getActiveEvents(): string[];
  getEventLog(): EventLog[];
  getRecentEvents(count?: number): EventLog[];
}

// ============================================================================
// State Interface
// ============================================================================

export interface StateInterface<T> {
  getInitialState(): T;
  init(): void;
  destroy(): void;
  getState(): T;
  setState(updates: Partial<T>): void;
  subscribe(callback: StateObserver<T>): UnsubscribeFunction;
  emit(eventName: string, data?: EventData): void;
  on<E extends EventData = EventData>(
    eventName: string,
    handler: EventHandler<E>,
  ): UnsubscribeFunction;
  off<E extends EventData = EventData>(
    eventName: string,
    handler: EventHandler<E>,
  ): void;
}

// ============================================================================
// Wallpaper and Assets
// ============================================================================

export interface Wallpapers {
  default: string;
  apocalypse?: string;
  [key: string]: string | undefined;
}

export interface Icons {
  computer: string;
  recycleBin: string;
  fileExplorer: string;
  steam: string;
  photos: string;
  movies: string;
  briefcase: string;
  graduation: string;
  projects: string;
  music: string;
  windowsLogo: string;
  volume: string;
  network: string;
  battery: string;
  [key: string]: string;
}

// ============================================================================
// Column Positions
// ============================================================================

export interface ColumnPositions {
  left: number;
  middle: number;
  right: number;
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationConfig {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose?: () => void;
}

// ============================================================================
// Tooltip Types
// ============================================================================

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipOptions {
  position?: TooltipPosition;
  offset?: number;
  delay?: number;
}
