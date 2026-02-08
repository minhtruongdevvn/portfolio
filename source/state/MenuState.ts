/**
 * MenuState - Manages dropdown menus
 * GLOBAL STATE - Only one menu active at a time
 */

import { BaseState } from './BaseState.js';
import { DropdownMenu } from '../components/DropdownMenu.js';
import type {
  EventBusInterface,
  MenuStateData,
  MenuItem,
  Position,
  UnsubscribeFunction
} from '../types/index.js';

export class MenuState extends BaseState<MenuStateData> {
  private activeMenu: DropdownMenu | null;
  private clickOutsideHandler: ((e: MouseEvent) => void) | null;
  private unsubscribeSelection: UnsubscribeFunction | null;
  private unsubscribeDrag: UnsubscribeFunction | null;

  constructor(eventBus: EventBusInterface) {
    super(eventBus);
    this.activeMenu = null;
    this.clickOutsideHandler = null;
    this.unsubscribeSelection = null;
    this.unsubscribeDrag = null;
  }

  getInitialState(): MenuStateData {
    return {
      activeMenuId: null,
      menuPosition: null
    };
  }

  /**
   * Setup event listeners
   */
  protected setupEventListeners(): void {
    // Listen for clicks outside menu
    this.clickOutsideHandler = (e: MouseEvent): void => {
      const menuElement = this.activeMenu?.getElement();
      if (this.activeMenu && menuElement) {
        const target = e.target as HTMLElement;
        if (!menuElement.contains(target) &&
            !target.closest('.desktop-icon')) {
          this.closeMenu();
        }
      }
    };
    document.addEventListener('click', this.clickOutsideHandler);

    // Listen for selection changes - close menu when selecting
    this.unsubscribeSelection = this.on('selection:started', () => {
      this.closeMenu();
    });

    // Listen for drag start - close menu when dragging
    this.unsubscribeDrag = this.on('drag:started', () => {
      this.closeMenu();
    });
  }

  /**
   * Teardown event listeners
   */
  protected teardownEventListeners(): void {
    if (this.clickOutsideHandler) {
      document.removeEventListener('click', this.clickOutsideHandler);
      this.clickOutsideHandler = null;
    }

    if (this.unsubscribeSelection) {
      this.unsubscribeSelection();
      this.unsubscribeSelection = null;
    }

    if (this.unsubscribeDrag) {
      this.unsubscribeDrag();
      this.unsubscribeDrag = null;
    }
  }

  /**
   * Show menu for an icon
   * @param {HTMLElement} iconElement - Icon DOM element
   * @param {string} iconId - Icon ID
   * @param {MenuItem[]} menuItems - Menu items configuration
   */
  showMenu(iconElement: HTMLElement, iconId: string, menuItems: MenuItem[]): void {
    // Close existing menu if any
    this.closeMenu();

    // Create new menu
    const menu = new DropdownMenu(
      menuItems,
      iconId,
      this.handleMenuItemClick.bind(this)
    );
    const menuElement = menu.render();

    // Append to body
    document.body.appendChild(menuElement);

    // Calculate position (to the right of icon)
    const iconRect = iconElement.getBoundingClientRect();
    const x = iconRect.right + 5;
    const y = iconRect.top;

    // Show menu
    menu.show(x, y);

    // Store active menu
    this.activeMenu = menu;
    const position: Position = { x, y };
    this.setState({
      activeMenuId: iconId,
      menuPosition: position
    });

    this.emit('menu:opened', { iconId, position });
  }

  /**
   * Close active menu
   */
  closeMenu(): void {
    if (!this.activeMenu) return;

    const iconId = this._state.activeMenuId;
    this.activeMenu.hide();

    setTimeout(() => {
      if (this.activeMenu) {
        this.activeMenu.destroy();
        this.activeMenu = null;
        this.setState({
          activeMenuId: null,
          menuPosition: null
        });

        this.emit('menu:closed', { iconId: iconId ?? undefined });
      }
    }, 150);
  }

  /**
   * Handle menu item click
   * @param {MenuItem} item - Menu item
   * @param {string} iconId - Icon ID
   */
  private handleMenuItemClick(item: MenuItem, iconId: string): void {
    console.log(`Menu item clicked: ${item.label} for icon: ${iconId}`);
    console.log(`Action: ${item.action}`);

    // Emit event for action handling
    this.emit('menu:itemClicked', { item, iconId });

    // Close menu after click
    this.closeMenu();
  }

  /**
   * Check if a menu is currently active
   * @returns {boolean}
   */
  hasActiveMenu(): boolean {
    return this.activeMenu !== null;
  }

  /**
   * Get active menu ID
   * @returns {string | null}
   */
  getActiveMenuId(): string | null {
    return this._state.activeMenuId;
  }

  /**
   * Destroy state and cleanup
   */
  destroy(): void {
    this.closeMenu();
    super.destroy();
  }
}
