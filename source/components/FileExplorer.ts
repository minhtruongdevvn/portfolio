/**
 * FileExplorer Component - File and folder browser window
 * Extends Window with file navigation and browsing capabilities
 */

import { Window, WindowConfig } from "./Window.js";
import type { FileItem } from "../types/index.js";

/**
 * Configuration for FileExplorer window
 */
export interface FileExplorerConfig extends WindowConfig {
  /** Root items to display */
  rootItems: FileItem[];
  /** Callback when a file is opened */
  onFileOpen?: (item: FileItem) => void;
}

/**
 * FileExplorer - Interactive file and folder browser
 */
export class FileExplorer extends Window {
  private currentPath: string[];
  private currentItems: FileItem[];
  private rootItems: FileItem[];
  private onFileOpen?: (item: FileItem) => void;
  private fileListContainer: HTMLElement | null;

  constructor(config: FileExplorerConfig) {
    super(config);
    this.currentPath = [];
    this.rootItems = config.rootItems;
    this.currentItems = this.rootItems;
    this.onFileOpen = config.onFileOpen;
    this.fileListContainer = null;
  }

  /**
   * Renders the file explorer window with navigation and file list
   */
  render(): HTMLElement {
    const element = super.render();

    if (this.contentContainer) {
      // Clear content container
      this.contentContainer.innerHTML = "";

      // Create navigation bar
      const navBar = this.createNavigationBar();
      this.contentContainer.appendChild(navBar);

      // Create file list container
      this.fileListContainer = document.createElement("div");
      this.fileListContainer.className = "file-explorer__list";
      this.contentContainer.appendChild(this.fileListContainer);

      // Render initial file list
      this.renderFileList();
    }

    return element;
  }

  /**
   * Creates the navigation bar with back button and path display
   */
  private createNavigationBar(): HTMLElement {
    const navBar = document.createElement("div");
    navBar.className = "file-explorer__nav";

    // Back button
    const backBtn = document.createElement("button");
    backBtn.className = "file-explorer__back-btn";
    backBtn.textContent = "←";
    backBtn.disabled = this.currentPath.length === 0;
    backBtn.addEventListener("click", () => this.navigateBack());

    // Path display
    const pathDisplay = document.createElement("div");
    pathDisplay.className = "file-explorer__path";
    pathDisplay.textContent = this.getCurrentPathString();

    navBar.appendChild(backBtn);
    navBar.appendChild(pathDisplay);

    return navBar;
  }

  /**
   * Renders the list of files and folders in the current directory
   */
  private renderFileList(): void {
    if (!this.fileListContainer) return;

    // Clear existing items
    this.fileListContainer.innerHTML = "";

    // Render each item
    this.currentItems.forEach((item) => {
      const itemElement = this.createFileItem(item);
      this.fileListContainer!.appendChild(itemElement);
    });
  }

  /**
   * Creates a file or folder element
   */
  private createFileItem(item: FileItem): HTMLElement {
    const itemElement = document.createElement("div");
    itemElement.className = `file-explorer__item file-explorer__item--${item.type}`;

    // Icon
    const icon = document.createElement("div");
    icon.className = "file-explorer__item-icon";

    // Name
    const name = document.createElement("div");
    name.className = "file-explorer__item-name";
    name.textContent = item.name;

    itemElement.appendChild(icon);
    itemElement.appendChild(name);

    // Robust double-click handler for mobile/desktop
    let clickCount = 0;
    let clickTimeout: ReturnType<typeof setTimeout> | null = null;

    itemElement.addEventListener("click", (e) => {
      // Native double click (Desktop/Modern Mobile)
      if (e.detail === 2) {
        if (clickTimeout) clearTimeout(clickTimeout);
        this.handleItemDoubleClick(item);
        clickCount = 0;
        return;
      }

      // Manual detection fallback for mobile touch
      clickCount++;
      if (clickCount === 1) {
        clickTimeout = setTimeout(() => {
          clickCount = 0;
        }, 500); // 500ms timeout for easier mobile tapping
      } else if (clickCount === 2) {
        if (clickTimeout) clearTimeout(clickTimeout);
        this.handleItemDoubleClick(item);
        clickCount = 0;
      }
    });

    return itemElement;
  }

  /**
   * Handles double-click on a file or folder item
   */
  private handleItemDoubleClick(item: FileItem): void {
    if (item.type === "folder") {
      // Navigate into folder
      this.currentPath.push(item.name);
      this.currentItems = item.items || [];
      this.updateView();
    } else {
      // Open file
      if (this.onFileOpen) {
        this.onFileOpen(item);
      }
    }
  }

  /**
   * Navigates back one level in the folder hierarchy
   */
  private navigateBack(): void {
    if (this.currentPath.length === 0) return;

    // Remove last path segment
    this.currentPath.pop();

    // Navigate to parent folder
    let items = this.rootItems;
    for (const pathSegment of this.currentPath) {
      const folder = items.find(
        (item) => item.name === pathSegment && item.type === "folder",
      );
      if (folder && folder.items) {
        items = folder.items;
      }
    }

    this.currentItems = items;
    this.updateView();
  }

  /**
   * Updates the navigation bar and file list
   */
  private updateView(): void {
    if (!this.contentContainer) return;

    // Re-render navigation bar
    const oldNavBar = this.contentContainer.querySelector(
      ".file-explorer__nav",
    );
    if (oldNavBar) {
      const newNavBar = this.createNavigationBar();
      this.contentContainer.replaceChild(newNavBar, oldNavBar);
    }

    // Re-render file list
    this.renderFileList();
  }

  /**
   * Gets the current path as a formatted string
   */
  private getCurrentPathString(): string {
    const pathParts = ["Computer", ...this.currentPath];
    return pathParts.join(" > ");
  }

  /**
   * Cleans up the file explorer window
   */
  destroy(): void {
    this.fileListContainer = null;
    super.destroy();
  }
}
