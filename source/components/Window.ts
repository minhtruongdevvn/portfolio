/**
 * Window Component - Base window with Windows 7 styling
 * Provides common window structure with title bar and close button
 */

export interface WindowConfig {
  id: string;
  title: string;
  icon: string;
  width?: number;
  height?: number;
  onClose?: () => void;
}

export class Window {
  public id: string;
  public title: string;
  public icon: string;
  public isVisible: boolean;
  public element: HTMLElement | null;
  protected contentContainer: HTMLElement | null;
  private config: WindowConfig;
  private bottomBarHeight = 40;
  private handleResizeBound: () => void;

  constructor(config: WindowConfig) {
    this.id = config.id;
    this.title = config.title;
    this.icon = config.icon;
    this.isVisible = false;
    this.element = null;
    this.contentContainer = null;
    this.config = config;
    this.handleResizeBound = this.applySize.bind(this);
  }

  render(): HTMLElement {
    this.element = document.createElement("div");
    this.element.className = "window";
    this.element.id = `window-${this.id}`;
    this.element.style.display = "none"; // Hidden by default

    // Title bar
    const titleBar = this.createTitleBar();

    // Content container (to be filled by subclasses)
    this.contentContainer = document.createElement("div");
    this.contentContainer.className = "window__content";

    this.element.appendChild(titleBar);
    this.element.appendChild(this.contentContainer);

    // Apply size (responsive on mobile)
    this.applySize();

    // Listen for window resize
    window.addEventListener("resize", this.handleResizeBound);

    return this.element;
  }

  private createTitleBar(): HTMLElement {
    const titleBar = document.createElement("div");
    titleBar.className = "window__title-bar";

    // Icon and title
    const titleSection = document.createElement("div");
    titleSection.className = "window__title-section";

    const icon = document.createElement("img");
    icon.className = "window__icon";
    icon.src = this.icon;
    icon.alt = "";

    const title = document.createElement("span");
    title.className = "window__title";
    title.textContent = this.title;

    titleSection.appendChild(icon);
    titleSection.appendChild(title);

    // Controls
    const controls = document.createElement("div");
    controls.className = "window__controls";

    const minimizeBtn = document.createElement("button");
    minimizeBtn.className = "window__control-btn window__control-btn--minimize";
    minimizeBtn.innerHTML = "—";
    minimizeBtn.addEventListener("click", () => this.hide());

    const closeBtn = document.createElement("button");
    closeBtn.className = "window__control-btn window__control-btn--close";
    closeBtn.innerHTML = "×";
    closeBtn.addEventListener("click", () => this.handleClose());

    controls.appendChild(minimizeBtn);
    controls.appendChild(closeBtn);
    titleBar.appendChild(titleSection);
    titleBar.appendChild(controls);

    return titleBar;
  }

  private applySize(): void {

    if (!this.element) return;

    const isMobile = window.innerWidth <= 700;

    if (isMobile) {
      // Full screen on mobile
      this.element.style.width = "100%";
      this.element.style.height = `calc(100% - ${this.bottomBarHeight}px)`; // Minus taskbar
      this.element.style.left = "0";
      this.element.style.top = "0";
    } else {
      // Dynamic size on desktop with 50px gap
      const gap = 25;
      const width = window.innerWidth - (gap * 2);
      const height = window.innerHeight - (gap * 2) - this.bottomBarHeight;

      this.element.style.width = `${Math.max(width, 300)}px`;
      this.element.style.height = `${Math.max(height, 200)}px`;

      this.element.style.left = `${gap}px`;
      this.element.style.top = `${gap}px`;
    }
  }

  protected handleClose(): void {
    if (this.config.onClose) {
      this.config.onClose();
    }
  }

  show(): void {
    if (this.element) {
      this.element.style.display = "flex";
      this.isVisible = true;
    }
  }

  hide(): void {
    if (this.element) {
      this.element.style.display = "none";
      this.isVisible = false;
    }
  }

  destroy(): void {
    window.removeEventListener("resize", this.handleResizeBound);
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.contentContainer = null;
  }
}
