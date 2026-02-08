/**
 * StartMenu Component
 * Custom Start Menu profile
 */

export class StartMenu {
  private element: HTMLElement | null;
  private isVisible: boolean;
  private onClose: () => void;
  private clickOutsideHandler: ((e: MouseEvent) => void) | null;

  constructor(onClose: () => void) {
    this.element = null;
    this.isVisible = false;
    this.onClose = onClose;
    this.clickOutsideHandler = null;
  }

  /**
   * Render the start menu
   */
  render(): HTMLElement {
    this.element = document.createElement('div');
    this.element.className = 'start-menu';

    // Header
    const header = document.createElement('div');
    header.className = 'start-menu__header';
    header.innerHTML = `
      <img src="assets/avatar.png" alt="Profile" class="start-menu__avatar" onerror="this.src='https://ui-avatars.com/api/?name=Minh+Truong&background=0D8ABC&color=fff'">
      <div class="start-menu__user-info">
        <div class="start-menu__name">Minh Truong</div>
        <div class="start-menu__title">Full-Stack Engineer</div>
      </div>
    `;

    // Content
    const content = document.createElement('div');
    content.className = 'start-menu__content';

    // Left Pane (Bio & Skills)
    const leftPane = document.createElement('div');
    leftPane.className = 'start-menu__left-pane';
    leftPane.innerHTML = `
      <div class="start-menu__section-title">About</div>
      <p class="start-menu__bio">
        Full-Stack Engineer focused on cloud infrastructure and secure, scalable systems. Background in cybersecurity and networking with hands-on experience across AWS and Azure.
      </p>
      <p class="start-menu__bio">
        Highly skilled in AI-augmented engineering, I ship 10x faster using AI tools while applying critical thinking and coding standards to keep architecture quality, security, and maintainability intact.
      </p>

      <div class="start-menu__section-title">Core Strengths</div>
      <ul class="start-menu__features-list">
        <li class="start-menu__feature-item">
          <span class="start-menu__feature-icon">▶</span>
          <span>Cloud platforms (AWS, Azure)</span>
        </li>
        <li class="start-menu__feature-item">
          <span class="start-menu__feature-icon">▶</span>
          <span>Microservices & API development</span>
        </li>
        <li class="start-menu__feature-item">
          <span class="start-menu__feature-icon">▶</span>
          <span>ICT Infrastructure (Oauth, DNSSEC, CA, networking)</span>
        </li>
        <li class="start-menu__feature-item">
          <span class="start-menu__feature-icon">▶</span>
          <span>Infrastructure automation & CI/CD</span>
        </li>
        <li class="start-menu__feature-item">
          <span class="start-menu__feature-icon">▶</span>
          <span>Security & Performance focus</span>
        </li>
      </ul>
      
      <div class="start-menu__section-title" style="margin-top: 20px;">Objective</div>
      <p class="start-menu__bio">
        Interested in Cloud Engineering or Full-Stack Development where I can leverage both my software development and/or cloud/security expertise.
      </p>


    `;

    // Right Pane (Contact & Personal)
    const rightPane = document.createElement('div');
    rightPane.className = 'start-menu__right-pane';
    rightPane.innerHTML = `
      <div class="start-menu__contact-item">
        <div class="start-menu__label">LinkedIn</div>
        <a href="https://linkedin.com/in/minhtruongdevvn" target="_blank" class="start-menu__link start-menu__value start-menu__link-truncate">linkedin.com/in/minhtruongdevvn</a>
      </div>
      
      <div class="start-menu__contact-item">
        <div class="start-menu__label">Phone</div>
        <div class="start-menu__value-row">
            <div class="start-menu__value">+64 451 705 254 (Mobile)</div>
            <button class="start-menu__copy-btn" onclick="navigator.clipboard.writeText('+64451705254')" title="Copy Phone">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
        </div>
      </div>
      
      <div class="start-menu__contact-item">
        <div class="start-menu__label">Email</div>
        <div class="start-menu__value-row">
            <a href="mailto:minhtruongdevvn@gmail.com" class="start-menu__link start-menu__value start-menu__link-truncate">minhtruongdevvn@gmail.com</a>
            <button class="start-menu__copy-btn" onclick="navigator.clipboard.writeText('minhtruongdevvn@gmail.com')" title="Copy Email">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
        </div>
      </div>

      <div class="start-menu__contact-item" style="margin-top: 15px;">
        <div class="start-menu__label">Birthday</div>
        <div class="start-menu__value">January 6</div>
      </div>

      <div class="start-menu__contact-item">
        <div class="start-menu__label">Languages</div>
        <div class="start-menu__value">English (Professional)</div>
        <div class="start-menu__value">Vietnamese (Native)</div>
      </div>

      <div class="start-menu__contact-item">
        <div class="start-menu__label">Hobbies</div>
        <div class="start-menu__tags">
          <span class="start-menu__tag">Running</span>
          <span class="start-menu__tag">Movies</span>
          <span class="start-menu__tag">Gaming</span>
          <span class="start-menu__tag">Cooking</span>
          <span class="start-menu__tag">Gym</span>
        </div>
      </div>

      <div style="margin-top: auto; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
        <div class="start-menu__section-title" style="color: rgba(255,255,255,0.9); font-size: 13px; margin-bottom: 8px; border-bottom: none;">System Usage</div>
        <ul class="start-menu__features-list" style="margin: 0;">
          <li class="start-menu__feature-item" style="color: rgba(255,255,255,0.8); font-size: 12px; margin-bottom: 4px;">
            <span class="start-menu__feature-icon">ℹ️</span>
            <span>Double-click to open</span>
          </li>
          <li class="start-menu__feature-item" style="color: rgba(255,255,255,0.8); font-size: 12px; margin-bottom: 4px;">
            <span class="start-menu__feature-icon">✋</span>
            <span>Drag & drop to move icons</span>
          </li>
          <li class="start-menu__feature-item" style="color: rgba(255,255,255,0.8); font-size: 12px; margin-bottom: 4px;">
            <span class="start-menu__feature-icon">✨</span>
            <span>Select multiple on desktop</span>
          </li>
        </ul>
      </div>
    `;

    content.appendChild(leftPane);
    content.appendChild(rightPane);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'start-menu__footer';
    footer.innerHTML = `
      <button class="start-menu__shutdown-btn" onclick="window.location.reload()">
        <span>⏻</span> Restart System
      </button>
    `;

    this.element.appendChild(header);
    this.element.appendChild(content);
    this.element.appendChild(footer);

    // Prevent clicks inside menu from closing it
    this.element.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    return this.element;
  }

  /**
   * Show the start menu
   */
  show(container: HTMLElement, buttonRect: DOMRect): void {
    if (!this.element) {
      const el = this.render();
      container.appendChild(el);
    }

    // Position menu above the start button
    if (this.element) {
      this.element.style.bottom = `${buttonRect.height}px`;
      this.element.style.left = '0';

      // Force reflow
      this.element.offsetHeight; // trigger reflow

      this.element.classList.add('start-menu--visible');
      this.isVisible = true;

      // Setup click outside listener
      this.setupClickOutside();
    }
  }

  /**
   * Hide the start menu
   */
  hide(): void {
    if (this.element && this.isVisible) {
      this.element.classList.remove('start-menu--visible');
      this.isVisible = false;

      // Remove after transition
      setTimeout(() => {
        if (this.element && this.element.parentNode && !this.isVisible) {
          this.element.parentNode.removeChild(this.element);
          this.element = null;
        }
      }, 200);

      this.removeClickOutside();
    }
  }

  /**
   * Toggle visibility
   */
  toggle(container: HTMLElement, buttonRect: DOMRect): void {
    if (this.isVisible) {
      this.hide();
      this.onClose();
    } else {
      this.show(container, buttonRect);
    }
  }

  private setupClickOutside(): void {
    if (this.clickOutsideHandler) return;

    this.clickOutsideHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If clicking outside menu (and not on start button itself - handled by preventDefault in main logic usually)
      if (this.element && !this.element.contains(target) && !target.closest('.start-button')) {
        this.hide();
        this.onClose();
      }
    };

    // items inside taskbar (like clock) shouldn't close it instantly if logic is separated, 
    // but typically clicking anywhere else closes start menu
    document.addEventListener('click', this.clickOutsideHandler);
  }

  private removeClickOutside(): void {
    if (this.clickOutsideHandler) {
      document.removeEventListener('click', this.clickOutsideHandler);
      this.clickOutsideHandler = null;
    }
  }
}
