/**
 * InstructionOverlay Component
 * Shows a landing instruction pointing to the start button
 */

export class InstructionOverlay {
    private element: HTMLElement | null;

    constructor() {
        this.element = null;
    }

    /**
     * Check if instruction should be shown
     */
    shouldShow(): boolean {
        // Show once per session
        return !sessionStorage.getItem('instructionSeen');
    }

    /**
     * Render the overlay
     */
    render(): void {
        // Only verify if we should show it
        if (!this.shouldShow()) return;

        this.element = document.createElement('div');
        this.element.className = 'instruction-overlay';

        // Click anywhere to dismiss logic (optional, user asked for OK button specifically)
        // But usually shadowing screen means modal behavior.
        // I'll make the background click dismiss too for better UX, 
        // but the button confirms the action.
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.dismiss();
            }
        });

        const container = document.createElement('div');
        container.className = 'instruction-container';

        // Create arrow SVG (pointing down-left roughly)
        // Using a transform in CSS for rotation
        const arrowSvg = `
      <svg class="instruction-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
    `;

        container.innerHTML = `
      <div class="instruction-text">Start Here</div>
      <div class="instruction-subtext">Click the Window button to begin exploring my portfolio</div>
      ${arrowSvg}
    `;

        // OK Button
        const btn = document.createElement('button');
        btn.textContent = 'Got it!';
        btn.style.cssText = `
        margin-top: 15px;
        padding: 8px 24px;
        font-size: 16px;
        font-weight: 600;
        background: #3C89D2;
        color: white;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: background 0.2s;
    `;

        btn.onmouseover = () => { btn.style.background = '#4FA3E8'; };
        btn.onmouseout = () => { btn.style.background = '#3C89D2'; };

        btn.onclick = (e) => {
            e.stopPropagation();
            this.dismiss();
        };

        container.appendChild(btn); // Add button after text/arrow

        // Re-arrange: Text -> Subtext -> Button -> Arrow? 
        // Actually, Arrow should be pointing at the button.
        // Let's append arrow last so it's at the bottom pointing down.

        // Clear innerHTML to append strictly
        container.innerHTML = '';

        const textDiv = document.createElement('div');
        textDiv.className = 'instruction-text';
        textDiv.textContent = 'Start Here';

        const subtextDiv = document.createElement('div');
        subtextDiv.className = 'instruction-subtext';
        subtextDiv.textContent = 'Click to explore my portfolio';

        // Arrow container to rotate it properly if needed
        const arrowDiv = document.createElement('div');
        arrowDiv.innerHTML = arrowSvg;
        // Rotate arrow to point to bottom-left (approx 45deg if straight down)
        // In CSS I have transform: rotate(10deg). 
        // Straight down is 0deg relative to svg natural state? 
        // SVG natural state is Down. 
        // The container is at bottom: 60px, left: 60px.
        // Start button is at (0,0) of resizing context (screen bottom left).
        // So arrow needs to point down-left.
        // Rotate 45deg.
        (arrowDiv.firstElementChild as HTMLElement).style.transform = 'rotate(45deg)';

        container.appendChild(textDiv);
        container.appendChild(subtextDiv);
        container.appendChild(btn);
        container.appendChild(arrowDiv);

        this.element.appendChild(container);
        document.body.appendChild(this.element);
    }

    /**
     * Dismiss the overlay
     */
    dismiss(): void {
        if (this.element) {
            this.element.style.transition = 'opacity 0.5s ease';
            this.element.style.opacity = '0';

            sessionStorage.setItem('instructionSeen', 'true');

            setTimeout(() => {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
                this.element = null;
            }, 500);
        }
    }
}
