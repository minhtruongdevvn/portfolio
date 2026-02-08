/**
 * DropdownMenu Component
 * Renders context menus for desktop icons
 */

import type { MenuItem } from '../types/index.js';

type MenuItemWithSeparator = MenuItem | { type: 'separator' };

export class DropdownMenu {
  private menuItems: MenuItemWithSeparator[];
  private iconId: string;
  private onItemClick: (item: MenuItem, iconId: string) => void;
  private element: HTMLDivElement | null;

  constructor(menuItems: MenuItemWithSeparator[], iconId: string, onItemClick: (item: MenuItem, iconId: string) => void) {
    this.menuItems = menuItems;
    this.iconId = iconId;
    this.onItemClick = onItemClick;
    this.element = null;
  }

  /**
   * Render the dropdown menu
   */
  render(): HTMLDivElement {
    this.element = document.createElement('div');
    this.element.className = 'dropdown-menu';
    this.element.id = `menu-${this.iconId}`;

    const list = document.createElement('ul');
    list.className = 'dropdown-menu__list';

    this.menuItems.forEach(item => {
      if ('type' in item && item.type === 'separator') {
        const separator = document.createElement('li');
        separator.className = 'dropdown-menu__separator';
        list.appendChild(separator);
      } else {
        const menuItem = this.createMenuItem(item as MenuItem);
        list.appendChild(menuItem);
      }
    });

    this.element.appendChild(list);
    return this.element;
  }

  /**
   * Create a menu item element
   */
  private createMenuItem(item: MenuItem): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'dropdown-menu__item';

    if (item.disabled) {
      li.classList.add('dropdown-menu__item--disabled');
    }

    // Add icon if provided
    if (item.icon) {
      const icon = document.createElement('img');
      icon.className = 'dropdown-menu__item-icon';
      icon.src = item.icon;
      icon.alt = '';
      li.appendChild(icon);
    }

    // Add label
    const label = document.createElement('span');
    label.className = 'dropdown-menu__item-label';
    label.textContent = item.label;
    li.appendChild(label);

    // Add click handler
    if (!item.disabled) {
      li.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        this.onItemClick(item, this.iconId);
      });
    }

    return li;
  }

  /**
   * Show menu at specific position
   */
  show(x: number, y: number): void {
    if (!this.element) return;

    // Position menu
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;

    // Add visible class
    this.element.classList.add('dropdown-menu--visible');

    // Check viewport overflow and adjust position
    this.adjustPosition();
  }

  /**
   * Hide menu
   */
  hide(): void {
    if (!this.element) return;
    this.element.classList.remove('dropdown-menu--visible');
  }

  /**
   * Adjust position to prevent viewport overflow
   */
  private adjustPosition(): void {
    if (!this.element) return;

    const rect = this.element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = parseInt(this.element.style.left);
    let top = parseInt(this.element.style.top);

    // Check right overflow
    if (rect.right > viewportWidth) {
      left = viewportWidth - rect.width - 10;
    }

    // Check bottom overflow
    if (rect.bottom > viewportHeight) {
      top = viewportHeight - rect.height - 10;
    }

    // Check left overflow
    if (left < 0) {
      left = 10;
    }

    // Check top overflow
    if (top < 0) {
      top = 10;
    }

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  /**
   * Get menu element
   */
  getElement(): HTMLDivElement | null {
    return this.element;
  }

  /**
   * Destroy menu element
   */
  destroy(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
