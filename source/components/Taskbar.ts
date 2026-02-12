/**
 * Taskbar Component
 * Main taskbar container with Windows 7 styling
 */

import type { EventBusInterface, TaskbarEventData, TaskbarAppConfig } from '../types/index.js';
import { StartButton } from "./StartButton.js";
import { StartMenu } from "./StartMenu.js";
import { TaskbarApp } from "./TaskbarApp.js";
import { SystemTray } from "./SystemTray.js";
import { TASKBAR_APPS } from "../config/desktop-config.js";

export class Taskbar {
  public element: HTMLElement | null;
  private startButton: StartButton | null;
  private startMenu: StartMenu | null;
  private taskbarApps: TaskbarApp[];
  private mobileTaskbarApps: TaskbarApp[];
  private systemTray: SystemTray | null;
  private appsDropdown: HTMLElement | null;
  private isDropdownOpen: boolean;
  private mobileDropdownBtn: HTMLButtonElement | null;
  private eventBus: EventBusInterface;

  constructor(eventBus: EventBusInterface) {
    this.eventBus = eventBus;
    this.element = null;
    this.startButton = null;
    this.startMenu = null;
    this.taskbarApps = [];
    this.mobileTaskbarApps = [];
    this.systemTray = null;
    this.appsDropdown = null;
    this.isDropdownOpen = false;
    this.mobileDropdownBtn = null;
  }

  init(): void {
    this.eventBus.on<TaskbarEventData>('taskbar:addApp', (data) => {
      this.addApp(data as TaskbarAppConfig);
    });

    this.eventBus.on<TaskbarEventData>('taskbar:removeApp', (data) => {
      if (data.appId) this.removeApp(data.appId);
    });

    this.eventBus.on<TaskbarEventData>('taskbar:setAppActive', (data) => {
      if (data.appId) {
        // Update desktop app
        const app = this.getApp(data.appId);
        if (app && typeof data.active === 'boolean') {
          app.setActive(data.active);
        }

        // Update mobile app
        const mobileApp = this.getMobileApp(data.appId);
        if (mobileApp && typeof data.active === 'boolean') {
          mobileApp.setActive(data.active);
        }
      }
    });
  }

  /**
   * Render the taskbar
   */
  render(): HTMLElement {
    this.element = document.createElement("div");
    this.element.className = "taskbar";
    this.element.id = "taskbar";

    // Create start section
    const startSection = document.createElement("div");
    startSection.className = "taskbar__start-section";

    this.startButton = new StartButton();
    const startBtnEl = this.startButton.render();

    // Initialize Start Menu
    this.startMenu = new StartMenu(() => {
      // Callback when closed
      console.log('Start menu closed');
    });

    // Toggle start menu on click
    startBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.startMenu && this.startButton) {
        this.startMenu.toggle(document.body, startBtnEl.getBoundingClientRect());
      }
    });

    startSection.appendChild(startBtnEl);

    // Create apps section
    const appsSection = document.createElement("div");
    appsSection.className = "taskbar__apps-section";

    // Create mobile dropdown button
    const mobileDropdownBtn = document.createElement("button");
    mobileDropdownBtn.className = "taskbar__mobile-apps-button";
    mobileDropdownBtn.innerHTML = `
      <span class="taskbar__mobile-apps-text">Apps</span>
      <span class="taskbar__mobile-apps-count">${TASKBAR_APPS.length}</span>
      <span class="taskbar__mobile-apps-icon">▲</span>
    `;
    this.mobileDropdownBtn = mobileDropdownBtn;
    mobileDropdownBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleAppsDropdown();
    });
    appsSection.appendChild(mobileDropdownBtn);

    // Create dropdown menu for mobile
    this.appsDropdown = document.createElement("div");
    this.appsDropdown.className = "taskbar__apps-dropdown";

    // Add taskbar apps
    TASKBAR_APPS.forEach((appConfig) => {
      // Desktop App
      const app = new TaskbarApp(appConfig, this.eventBus);
      const appElement = app.render();

      // Mobile App (Dropdown)
      const mobileApp = new TaskbarApp(appConfig, this.eventBus);
      const dropdownApp = mobileApp.render();
      dropdownApp.addEventListener("click", () => {
        this.closeAppsDropdown();
      });
      this.appsDropdown!.appendChild(dropdownApp);
      this.mobileTaskbarApps.push(mobileApp);

      // Add original to apps section (desktop)
      appsSection.appendChild(appElement);
      this.taskbarApps.push(app);
    });

    // Create system tray section
    const systemTraySection = document.createElement("div");
    systemTraySection.className = "taskbar__system-tray";

    this.systemTray = new SystemTray();
    systemTraySection.appendChild(this.systemTray.render());

    // Append all sections
    this.element.appendChild(startSection);
    this.element.appendChild(appsSection);
    this.element.appendChild(systemTraySection);

    // Append dropdown menu (for mobile)
    this.element.appendChild(this.appsDropdown);

    // Setup global click listener to close dropdown
    document.addEventListener("click", () => {
      this.closeAppsDropdown();
    });

    return this.element;
  }

  /**
   * Toggle apps dropdown (mobile)
   */
  private toggleAppsDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;

    if (this.isDropdownOpen) {
      this.appsDropdown!.classList.add("taskbar__apps-dropdown--open");
      if (this.mobileDropdownBtn) {
        const icon = this.mobileDropdownBtn.querySelector(
          ".taskbar__mobile-apps-icon",
        );
        if (icon) icon.textContent = "▼";
        this.mobileDropdownBtn.classList.add(
          "taskbar__mobile-apps-button--active",
        );
      }
    } else {
      this.appsDropdown!.classList.remove("taskbar__apps-dropdown--open");
      if (this.mobileDropdownBtn) {
        const icon = this.mobileDropdownBtn.querySelector(
          ".taskbar__mobile-apps-icon",
        );
        if (icon) icon.textContent = "▲";
        this.mobileDropdownBtn.classList.remove(
          "taskbar__mobile-apps-button--active",
        );
      }
    }
  }

  /**
   * Close apps dropdown (mobile)
   */
  private closeAppsDropdown(): void {
    this.isDropdownOpen = false;
    if (this.appsDropdown) {
      this.appsDropdown.classList.remove("taskbar__apps-dropdown--open");
    }
  }

  /**
   * Add app to taskbar
   */
  addApp(appConfig: TaskbarAppConfig): void {
    // 1. Add to Desktop Taskbar
    const app = new TaskbarApp(appConfig, this.eventBus);
    const appsSection = this.element!.querySelector(".taskbar__apps-section");
    if (appsSection) {
      appsSection.appendChild(app.render());
      this.taskbarApps.push(app);
    }

    // 2. Add to Mobile Dropdown
    if (this.appsDropdown) {
      const mobileApp = new TaskbarApp(appConfig, this.eventBus);
      const mobileAppElement = mobileApp.render();
      mobileAppElement.addEventListener("click", () => {
        this.closeAppsDropdown();
      });
      this.appsDropdown.appendChild(mobileAppElement);
      this.mobileTaskbarApps.push(mobileApp);
    }

    // 3. Update Mobile Count
    this.updateMobileAppsCount();
  }

  /**
   * Remove app from taskbar
   */
  removeApp(appId: string): void {
    // 1. Remove from Desktop
    const appIndex = this.taskbarApps.findIndex((app) => app.id === appId);
    if (appIndex !== -1) {
      const app = this.taskbarApps[appIndex];
      if (app && app.element && app.element.parentNode) {
        app.element.parentNode.removeChild(app.element);
      }
      this.taskbarApps.splice(appIndex, 1);
    }

    // 2. Remove from Mobile
    const mobileAppIndex = this.mobileTaskbarApps.findIndex((app) => app.id === appId);
    if (mobileAppIndex !== -1) {
      const app = this.mobileTaskbarApps[mobileAppIndex];
      if (app && app.element && app.element.parentNode) {
        app.element.parentNode.removeChild(app.element);
      }
      this.mobileTaskbarApps.splice(mobileAppIndex, 1);
    }

    // 3. Update Mobile Count
    this.updateMobileAppsCount();
  }

  /**
   * Update the counter on the mobile apps button
   */
  private updateMobileAppsCount(): void {
    if (this.mobileDropdownBtn) {
      const countSpan = this.mobileDropdownBtn.querySelector(".taskbar__mobile-apps-count");
      if (countSpan) {
        // Count represents number of active/open apps, or just total apps in the list?
        // Based on original code `TASKBAR_APPS.length`, it was total apps.
        // Assuming we want to show total apps in the bar.
        countSpan.textContent = this.taskbarApps.length.toString();
      }
    }
  }

  /**
   * Get app by ID
   */
  getApp(appId: string): TaskbarApp | undefined {
    return this.taskbarApps.find((app) => app.id === appId);
  }

  /**
   * Get mobile app by ID
   */
  getMobileApp(appId: string): TaskbarApp | undefined {
    return this.mobileTaskbarApps.find((app) => app.id === appId);
  }

  /**
   * Destroy taskbar
   */
  destroy(): void {
    if (this.systemTray) {
      this.systemTray.destroy();
    }
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
