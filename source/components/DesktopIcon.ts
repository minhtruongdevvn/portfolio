/**
 * DesktopIcon Component
 * Individual desktop icon with drag and menu support
 */

import type {
  IconConfig,
  Position,
  MenuItem,
  MenuItemConfig,
  EventBusInterface,
} from "../types/index.js";
import type { DragState } from "../state/DragState.js";
import type { MenuState } from "../state/MenuState.js";
import type { TouchState } from "../state/TouchState.js";
import { selectionState } from "../state/SelectionState.js";

/**
 * Convert MenuItemConfig to MenuItem format
 */
function convertMenuItems(items: MenuItemConfig[]): MenuItem[] {
  return items
    .filter(
      (item): item is Extract<MenuItemConfig, { id: string }> =>
        "id" in item && !!item.id,
    )
    .map((item) => ({
      label: item.label,
      action: item.action,
      disabled: item.disabled,
    }));
}

export class DesktopIcon {
  public id: string;
  public name: string;
  public icon: string;
  public position: Position;
  public menuItems: MenuItem[];
  public element: HTMLElement | null;
  public isSelected: boolean;
  private dragState: DragState | null;
  private menuState: MenuState;
  private touchState: TouchState | null;
  private eventBus: EventBusInterface | null;
  private clickTimeout: ReturnType<typeof setTimeout> | null;
  private clickCount: number;

  constructor(
    config: IconConfig,
    dragState: DragState | null,
    menuState: MenuState,
    touchState: TouchState | null = null,
    eventBus: EventBusInterface | null = null,
  ) {
    this.id = config.id;
    this.name = config.name;
    this.icon = config.icon;
    this.position = (config.position as Position) || { x: 0, y: 0 };
    this.menuItems = config.menuItems ? convertMenuItems(config.menuItems) : [];
    this.dragState = dragState;
    this.menuState = menuState;
    this.touchState = touchState;
    this.eventBus = eventBus;
    this.element = null;
    this.isSelected = false;
    this.clickTimeout = null;
    this.clickCount = 0;
  }

  render(): HTMLElement {
    this.element = document.createElement("div");
    this.element.className = "desktop-icon";
    this.element.id = `icon-${this.id}`;

    // Only enable dragging if dragState is provided (not on mobile)
    this.element.draggable = this.dragState !== null;

    // Set position
    this.element.style.left = `${this.position.x}px`;
    this.element.style.top = `${this.position.y}px`;

    // Create image container
    const imageContainer = document.createElement("div");
    imageContainer.className = "desktop-icon__image-container";

    const image = document.createElement("img");
    image.className = "desktop-icon__image";
    image.src = this.icon;
    image.alt = this.name;

    imageContainer.appendChild(image);

    const label = document.createElement("div");
    label.className = "desktop-icon__label";
    label.textContent = this.name;

    this.element.appendChild(imageContainer);
    this.element.appendChild(label);

    // Create tooltip (only on non-touch devices)
    if (!("ontouchstart" in window)) {
      const tooltip = document.createElement("div");
      tooltip.className = "desktop-icon__tooltip";
      tooltip.textContent = this.name;
      this.element.appendChild(tooltip);
    }

    this.setupEventListeners();

    if (this.touchState) {
      this.touchState.setupTouchHandlers(this.element, this.id);
    }

    return this.element;
  }

  private setupEventListeners(): void {
    // Drag events (only if drag is enabled)
    if (this.dragState) {
      this.element!.addEventListener(
        "dragstart",
        this.handleDragStart.bind(this),
      );
      this.element!.addEventListener("drag", this.handleDrag.bind(this));
      this.element!.addEventListener("dragend", this.handleDragEnd.bind(this));
    }

    // Click events
    this.element!.addEventListener("click", this.handleClick.bind(this));

    this.element!.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.handleRightClick(e);
    });
  }

  private handleDragStart(e: DragEvent): void {
    if (this.dragState && this.element) {
      this.dragState.handleDragStart(this.element, this.id, e);
    }
  }

  private handleDrag(e: DragEvent): void {
    if (this.dragState) {
      this.dragState.handleDrag(e);
    }
  }

  private handleDragEnd(e: DragEvent): void {
    if (this.dragState) {
      this.dragState.handleDragEnd(this.id, e);
    }
  }

  private handleRightClick(e: MouseEvent): void {
    e.stopPropagation();
    this.showMenu();
  }

  private handleClick(e: MouseEvent): void {
    e.stopPropagation();

    this.clickCount++;
    selectionState.deselectAll();
    selectionState.setIcons.bind(this);

    if (this.clickCount === 1) {
      // First click
      this.select();
      this.clickTimeout = setTimeout(() => {
        this.clickCount = 0;
      }, 250);
    } else if (this.clickCount === 2) {
      // Double click
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
      }
      this.handleDoubleClick();
      this.clickCount = 0;
    }
  }

  private showMenu(): void {
    // Close other menus first
    this.menuState.closeMenu();

    // Show menu for this icon
    this.menuState.showMenu(this.element!, this.id, this.menuItems);

    // Select icon
    this.select();
  }

  private handleDoubleClick(): void {
    if (this.eventBus) {
      this.eventBus.emit("icon:doubleClick", { iconId: this.id });
    }
  }

  select(): void {
    this.isSelected = true;
    this.element!.classList.add("desktop-icon--selected");
  }

  deselect(): void {
    this.isSelected = false;
    this.element!.classList.remove("desktop-icon--selected");
  }

  setPosition(x: number, y: number): void {
    this.position = { x, y };
    if (this.element) {
      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
    }
  }

  getPosition(): Position {
    return { ...this.position };
  }

  destroy(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
