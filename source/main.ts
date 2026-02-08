import {
  eventBus,
  selectionState,
  MenuState,
  DragState,
  TouchState,
} from "./state/index.js";
import { WindowState } from "./state/WindowState.js";
import { DesktopIcon } from "./components/DesktopIcon.js";
import { Taskbar } from "./components/Taskbar.js";
import { InstructionOverlay } from "./components/InstructionOverlay.js";
import { DESKTOP_ICONS } from "./config/desktop-config.js";
import { WALLPAPERS } from "./config/assets.js";
import { notify } from "./managers/NotificationManager.js";
import type { IconConfig } from "./types/index.js";

// Extend Window interface for debugging globals
declare global {
  interface Window {
    desktopApp: DesktopApp;
    notify: typeof notify;
  }
}

interface ColumnPositions {
  left: number;
  middle: number;
  right: number;
}

class DesktopApp {
  private menuState: MenuState;
  private dragState: DragState;
  private touchState: TouchState;
  private windowState: WindowState;
  private desktopIconComponents: DesktopIcon[];
  private taskbar: Taskbar | null;

  constructor() {
    // Initialize states
    this.menuState = new MenuState(eventBus);
    this.dragState = new DragState(eventBus);
    this.touchState = new TouchState(eventBus);
    this.windowState = new WindowState(eventBus);

    this.desktopIconComponents = [];
    this.taskbar = null;
  }

  private isMobile(): boolean {
    return window.innerWidth <= 700;
  }

  init(): void {
    // Initialize notification system
    notify.init();

    // Initialize states
    selectionState.init();
    this.menuState.init();
    this.dragState.init();
    this.windowState.init();
    // touchState has no init (not BaseState)

    // Set desktop wallpaper
    this.setDesktopWallpaper();

    // Render desktop icons
    this.renderDesktopIcons();

    // Render taskbar
    this.renderTaskbar();

    // Setup global event listeners
    this.setupEventListeners();

    // Setup icon config provider
    eventBus.on("window:requestIconConfig", (data) => {
      const iconConfig = DESKTOP_ICONS.find((ic) => ic.id === data.iconId);
      if (iconConfig) {
        this.openWindowFromConfig(iconConfig);
      }
    });

    // Show notification
    let isShowInfo = false;

    const checkScreen = () => {
      if (this.isMobile() && !isShowInfo) {
        notify.info("This website is design for desktop and laptop screens");
        isShowInfo = true;
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    // Show landing instruction overlay
    new InstructionOverlay().render();
  }

  /**
   * Open window based on icon configuration
   */
  private openWindowFromConfig(config: IconConfig): void {
    if (!config.contentType || !config.contentData) return;

    if (config.contentType === "folder" && config.contentData.items) {
      this.windowState.openFileExplorer({
        id: config.id,
        title: config.name,
        icon: config.icon,
        rootItems: config.contentData.items,
      });
    } else if (config.contentType === "iframe" && config.contentData.url) {
      this.windowState.openIframeViewer({
        id: config.id,
        title: config.name,
        icon: config.icon,
        url: config.contentData.url,
      });
    } else if (config.contentType === "text" && config.contentData.text) {
      this.windowState.openTextEditor({
        id: config.id,
        title: config.name,
        icon: config.icon,
        text: config.contentData.text,
      });
    }
  }

  /**
   * Set desktop wallpaper from config
   */
  private setDesktopWallpaper(): void {
    const desktop = document.getElementById("desktop");
    if (desktop && WALLPAPERS.apocalypse) {
      desktop.style.backgroundImage = `url('${WALLPAPERS.apocalypse}')`;
    }
  }

  /**
   * Render all desktop icons
   */
  private renderDesktopIcons(): void {
    const desktopContainer = document.getElementById("desktop");
    if (!desktopContainer) return;

    const isMobile = this.isMobile();

    // Calculate column positions based on desktop width
    const desktopWidth = desktopContainer.clientWidth;
    const columnPositions = this.calculateColumnPositions(desktopWidth);

    DESKTOP_ICONS.forEach((iconConfig) => {
      // Adjust icon position based on column
      const adjustedConfig = { ...iconConfig };
      if (iconConfig.column && iconConfig.position) {
        const yPos =
          "x" in iconConfig.position
            ? iconConfig.position.y
            : iconConfig.position.y;
        adjustedConfig.position = {
          x: columnPositions[iconConfig.column],
          y: yPos,
        };
      }

      // Create icon instance
      // On mobile, disable drag by not passing states
      const icon = new DesktopIcon(
        adjustedConfig,
        isMobile ? null : this.dragState,
        this.menuState,
        isMobile ? null : this.touchState,
        eventBus,
      );

      // Render icons
      const iconElement = icon.render();
      desktopContainer.appendChild(iconElement);

      // Store reference
      this.desktopIconComponents.push(icon);
    });

    // Set icons in selection state
    selectionState.setIcons(this.desktopIconComponents);
  }

  private calculateColumnPositions(desktopWidth: number): ColumnPositions {
    // Three columns: left, middle, right
    // Left: 20px from edge
    // Middle: centered
    // Right: 100px from right edge (accounting for icon width ~80px)
    return {
      left: 20,
      middle: Math.max(Math.floor((desktopWidth - 80) / 2), 300),
      right: Math.max(desktopWidth - 100, 600),
    };
  }

  /**
   * Render taskbar
   */
  private renderTaskbar(): void {
    this.taskbar = new Taskbar(eventBus);
    this.taskbar.init();
    const taskbarElement = this.taskbar.render();

    // Replace placeholder taskbar
    const existingTaskbar = document.getElementById("taskbar");
    if (existingTaskbar && existingTaskbar.parentNode) {
      existingTaskbar.parentNode.replaceChild(taskbarElement, existingTaskbar);
    }
  }

  /**
   * Setup global event listeners
   */
  private setupEventListeners(): void {
    // Desktop click
    const desktop = document.getElementById("desktop");
    if (!desktop) return;

    desktop.addEventListener("click", (e: MouseEvent) => {
      if ((e.target as HTMLElement).id === "desktop") {
        this.menuState.closeMenu();
      }
    });

    // Selection box on desktop (mouse down/move/up) - desktop only
    if (!this.isMobile()) {
      let isMouseDown = false;
      let startX = 0;
      let startY = 0;

      desktop.addEventListener("mousedown", (e: MouseEvent) => {
        // Only start selection if clicking on desktop itself (not icons)
        if ((e.target as HTMLElement).id === "desktop") {
          isMouseDown = true;
          const rect = desktop.getBoundingClientRect();
          startX = e.clientX - rect.left;
          startY = e.clientY - rect.top;

          selectionState.startSelection(startX, startY);
          e.preventDefault();
        }
      });

      desktop.addEventListener("mousemove", (e: MouseEvent) => {
        if (isMouseDown && selectionState.isActivelySelecting()) {
          const rect = desktop.getBoundingClientRect();
          const currentX = e.clientX - rect.left;
          const currentY = e.clientY - rect.top;

          selectionState.updateSelection(currentX, currentY);
          e.preventDefault();
        }
      });

      desktop.addEventListener("mouseup", (_e: MouseEvent) => {
        if (isMouseDown) {
          isMouseDown = false;
          selectionState.endSelection();
        }
      });

      // Also end selection if mouse leaves desktop
      desktop.addEventListener("mouseleave", (_e: MouseEvent) => {
        if (isMouseDown) {
          isMouseDown = false;
          selectionState.endSelection();
        }
      });
    }

    this.dragState.setupDesktopDragOver();

    // Prevent text selection during drag
    document.addEventListener("selectstart", (e: Event) => {
      if (this.dragState.getState().isDragging) {
        e.preventDefault();
      }
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      this.handleWindowResize();
    });
  }

  private handleWindowResize(): void {
    const desktop = document.getElementById("desktop");
    if (!desktop) return;

    const desktopWidth = desktop.clientWidth;
    const desktopRect = desktop.getBoundingClientRect();
    const columnPositions = this.calculateColumnPositions(desktopWidth);

    // Update icon positions based on new column calculations
    this.desktopIconComponents.forEach((icon, index) => {
      const iconConfig = DESKTOP_ICONS[index];
      if (!iconConfig || !icon.element) return;

      const position = icon.getPosition();
      const iconRect = icon.element.getBoundingClientRect();

      let newX = position.x;
      let newY = position.y;
      let updated = false;

      // Recalculate column position if icon has a column
      if (iconConfig.column) {
        newX = columnPositions[iconConfig.column];
        updated = true;
      }

      // Check if icon is out of bounds vertically
      if (position.y + iconRect.height > desktopRect.height) {
        newY = Math.max(0, desktopRect.height - iconRect.height);
        updated = true;
      }

      // Update position if needed
      if (updated) {
        icon.setPosition(newX, newY);
      }
    });
  }

  getIcon(iconId: string): DesktopIcon | undefined {
    return this.desktopIconComponents.find((icon) => icon.id === iconId);
  }

  destroy(): void {
    // Destroy all icons
    this.desktopIconComponents.forEach((icon) => icon.destroy());
    this.desktopIconComponents = [];

    // Destroy states
    selectionState.destroy();
    this.menuState.destroy();
    this.dragState.destroy();
    this.windowState.destroy();

    // Destroy taskbar
    if (this.taskbar) {
      this.taskbar.destroy();
    }
  }
}

// Initialize application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new DesktopApp();
  app.init();

  // Make app and notify available globally for debugging
  window.desktopApp = app;
  window.notify = notify;
});
