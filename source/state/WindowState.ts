/**
 * WindowState - Manages window lifecycle and visibility
 * GLOBAL STATE - Manages all open windows
 */

import { BaseState } from "./BaseState.js";
import { Window } from "../components/Window.js";
import { FileExplorer } from "../components/FileExplorer.js";
import { IframeViewer } from "../components/IframeViewer.js";
import { TextEditor } from "../components/TextEditor.js";
import type {
  EventBusInterface,
  UnsubscribeFunction,
  FileItem,
  IconEventData,
  MenuEventData,
  WindowEventData,
} from "../types/index.js";
import { BASE_URL } from "../config/assets.js";

export interface WindowStateData {
  openWindows: Map<string, Window>;
  activeWindowId: string | null;
}

export class WindowState extends BaseState<WindowStateData> {
  private unsubscribeIconDoubleClick: UnsubscribeFunction | null;
  private unsubscribeMenuAction: UnsubscribeFunction | null;
  private unsubscribeTaskbarClick: UnsubscribeFunction | null;

  constructor(eventBus: EventBusInterface) {
    super(eventBus);
    this.unsubscribeIconDoubleClick = null;
    this.unsubscribeMenuAction = null;
    this.unsubscribeTaskbarClick = null;
  }

  getInitialState(): WindowStateData {
    return {
      openWindows: new Map(),
      activeWindowId: null,
    };
  }

  protected setupEventListeners(): void {
    // Listen for icon double-click
    this.unsubscribeIconDoubleClick = this.on<IconEventData>(
      "icon:doubleClick",
      (data) => {
        if (data.iconId) {
          this.openWindowForIcon(data.iconId);
        }
      },
    );

    // Listen for menu actions
    this.unsubscribeMenuAction = this.on<MenuEventData>(
      "menu:itemClicked",
      (data) => {
        if (data.item?.action === "open" && data.iconId) {
          this.openWindowForIcon(data.iconId);
        }
      },
    );

    // Listen for taskbar app clicks
    this.unsubscribeTaskbarClick = this.on<WindowEventData>(
      "taskbar:appClicked",
      (data) => {
        if (data.appId) {
          this.switchToWindow(data.appId);
        }
      },
    );
  }

  protected teardownEventListeners(): void {
    if (this.unsubscribeIconDoubleClick) {
      this.unsubscribeIconDoubleClick();
      this.unsubscribeIconDoubleClick = null;
    }
    if (this.unsubscribeMenuAction) {
      this.unsubscribeMenuAction();
      this.unsubscribeMenuAction = null;
    }
    if (this.unsubscribeTaskbarClick) {
      this.unsubscribeTaskbarClick();
      this.unsubscribeTaskbarClick = null;
    }
  }

  /**
   * Open window for an icon based on its content configuration
   */
  private openWindowForIcon(iconId: string): void {
    // Check if window already open
    if (this._state.openWindows.has(iconId)) {
      this.switchToWindow(iconId);
      return;
    }

    // Emit event to request icon config from main.ts
    this.emit("window:requestIconConfig", { iconId });
  }

  /**
   * Create and open a FileExplorer window
   */
  openFileExplorer(config: {
    id: string;
    title: string;
    icon: string;
    rootItems: FileItem[];
  }): void {
    const window = new FileExplorer({
      ...config,
      icon: `${BASE_URL}assets/icons/file-explorer.svg`,
      onClose: () => this.closeWindow(config.id),
      onFileOpen: (file: FileItem) => this.handleFileOpen(file, config.id),
    });

    this.registerWindow(config.id, window);
  }

  /**
   * Create and open an IframeViewer window
   */
  openIframeViewer(config: {
    id: string;
    title: string;
    icon: string;
    url: string;
  }): void {
    const window = new IframeViewer({
      ...config,
      icon: `${BASE_URL}assets/icons/iframe.svg`,
      onClose: () => this.closeWindow(config.id),
    });

    this.registerWindow(config.id, window);
  }

  /**
   * Create and open a TextEditor window
   */
  openTextEditor(config: {
    id: string;
    title: string;
    icon: string;
    text?: string;
    readOnly?: boolean;
  }): void {
    const window = new TextEditor({
      ...config,
      initialText: config.text,
      readOnly: config.readOnly,
      icon: `${BASE_URL}assets/icons/text-editor.svg`,
      onClose: () => this.closeWindow(config.id),
    });

    this.registerWindow(config.id, window);
  }

  /**
   * Handle file open from FileExplorer
   */
  private handleFileOpen(file: FileItem, parentId: string): void {
    const windowId = `${parentId}-${file.name.replace(/\s+/g, "-")}`;

    if (file.contentType === "iframe" && file.url) {
      this.openIframeViewer({
        id: windowId,
        title: file.name,
        icon: "/assets/icons/file-explorer.svg",
        url: file.url,
      });
    } else if (file.contentType === "text") {
      this.openTextEditor({
        id: windowId,
        title: file.name,
        icon: "/assets/icons/file-explorer.svg",
        text: file.text || "",
        readOnly: true,
      });
    }
  }

  /**
   * Register a window and add to DOM
   */
  private registerWindow(id: string, window: Window): void {
    // Render and append to desktop
    const windowElement = window.render();
    const desktop = document.getElementById("desktop");
    if (desktop) {
      desktop.appendChild(windowElement);
    }

    // Hide all other windows
    this._state.openWindows.forEach((w) => w.hide());

    // Show this window
    window.show();

    // Update state
    const newWindows = new Map(this._state.openWindows);
    newWindows.set(id, window);

    this.setState({
      openWindows: newWindows,
      activeWindowId: id,
    });

    // Emit events
    this.emit("window:opened", { windowId: id });
    this.emit("taskbar:addApp", {
      id,
      name: window.title,
      icon: window.icon,
      running: true,
      active: true,
    });
  }

  /**
   * Switch to an existing window
   */
  switchToWindow(windowId: string): void {
    const window = this._state.openWindows.get(windowId);
    if (!window) return;

    // Hide all windows
    this._state.openWindows.forEach((w, id) => {
      w.hide();
      // Update taskbar state
      this.emit("taskbar:setAppActive", { appId: id, active: false });
    });

    // Show selected window
    window.show();

    // Update state
    this.setState({ activeWindowId: windowId });

    // Update taskbar
    this.emit("taskbar:setAppActive", { appId: windowId, active: true });
    this.emit("window:activated", { windowId });
  }

  /**
   * Close a window
   */
  closeWindow(windowId: string): void {
    const window = this._state.openWindows.get(windowId);
    if (!window) return;

    // Destroy window
    window.destroy();

    // Update state
    const newWindows = new Map(this._state.openWindows);
    newWindows.delete(windowId);

    let newActiveId = this._state.activeWindowId;
    if (newActiveId === windowId) {
      newActiveId = null;
    }

    this.setState({
      openWindows: newWindows,
      activeWindowId: newActiveId,
    });

    // Remove from taskbar
    this.emit("taskbar:removeApp", { appId: windowId });
    this.emit("window:closed", { windowId });
  }

  /**
   * Get active window
   */
  getActiveWindow(): Window | null {
    if (!this._state.activeWindowId) return null;
    return this._state.openWindows.get(this._state.activeWindowId) || null;
  }

  /**
   * Check if window is open
   */
  isWindowOpen(windowId: string): boolean {
    return this._state.openWindows.has(windowId);
  }

  /**
   * Destroy all windows
   */
  destroy(): void {
    this._state.openWindows.forEach((window) => window.destroy());
    super.destroy();
  }
}
