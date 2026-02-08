/**
 * TaskbarApp Component
 * Individual app icon in taskbar
 */

import type { EventBusInterface } from '../types/index.js';
import type { TaskbarAppConfig } from '../types/index.js';

export class TaskbarApp {
  public id: string;
  public name: string;
  public icon: string;
  public pinned: boolean;
  public running: boolean;
  public active: boolean;
  public element: HTMLElement | null;
  private eventBus: EventBusInterface;

  constructor(config: TaskbarAppConfig, eventBus: EventBusInterface) {
    this.eventBus = eventBus;
    this.id = config.id;
    this.name = config.name;
    this.icon = config.icon;
    this.pinned = config.pinned || false;
    this.running = config.running || false;
    this.active = config.active || false;
    this.element = null;
  }

  /**
   * Render the taskbar app
   */
  render(): HTMLElement {
    this.element = document.createElement('div');
    this.element.className = 'taskbar-app';
    this.element.id = `taskbar-app-${this.id}`;

    if (this.running) {
      this.element.classList.add('taskbar-app--running');
    }

    if (this.active) {
      this.element.classList.add('taskbar-app--active');
    }

    // Create icon
    const icon = document.createElement('img');
    icon.className = 'taskbar-app__icon';
    icon.src = this.icon;
    icon.alt = this.name;

    // Create label
    const label = document.createElement('span');
    label.className = 'taskbar-app__label';
    label.textContent = this.name;

    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'taskbar-app__tooltip';
    tooltip.textContent = this.name;

    this.element.appendChild(icon);
    this.element.appendChild(label);
    this.element.appendChild(tooltip);

    // Setup event listeners
    this.setupEventListeners();

    return this.element;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    this.element!.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Handle click event
   */
  private handleClick(e: MouseEvent): void {
    e.stopPropagation();
    this.eventBus.emit('taskbar:appClicked', { appId: this.id });
  }

  /**
   * Set running state
   */
  setRunning(running: boolean): void {
    this.running = running;
    if (this.element) {
      if (running) {
        this.element.classList.add('taskbar-app--running');
      } else {
        this.element.classList.remove('taskbar-app--running');
      }
    }
  }

  /**
   * Set active state
   */
  setActive(active: boolean): void {
    this.active = active;
    if (this.element) {
      if (active) {
        this.element.classList.add('taskbar-app--active');
      } else {
        this.element.classList.remove('taskbar-app--active');
      }
    }
  }
}
