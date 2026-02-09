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
    return !sessionStorage.getItem("instructionSeen");
  }

  /**
   * Dismiss the overlay
   */
  dismiss(): void {
    if (this.element) {
      // Prevent multiple dismissals
      if (this.element.style.opacity === "0") {
        return;
      }

      // Disable pointer events immediately to prevent further clicks
      this.element.style.pointerEvents = "none";
      this.element.style.transition = "opacity 0.3s ease";
      this.element.style.opacity = "0";

      sessionStorage.setItem("instructionSeen", "true");

      setTimeout(() => {
        if (this.element && this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
      }, 300);
    }
  }

  /**
   * Render the overlay
   */
  render(): void {
    // Only verify if we should show it
    if (!this.shouldShow()) return;

    this.element = document.createElement("div");
    this.element.className = "instruction-overlay";

    // Click anywhere to dismiss logic (optional, user asked for OK button specifically)
    // But usually shadowing screen means modal behavior.
    // I'll make the background click dismiss too for better UX,
    // but the button confirms the action.
    this.element.addEventListener("click", (e) => {
      if (e.target === this.element) {
        this.dismiss();
      }
    });

    const container = document.createElement("div");
    container.className = "instruction-container";

    // Create arrow SVG (pointing down-left roughly)
    // Using a transform in CSS for rotation
    const arrowSvg = `
      <svg class="instruction-arrow" viewBox="0 0 12 36" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="6" y1="2" x2="6" y2="30"></line>
        <polyline points="10 26 6 30 2 26"></polyline>
      </svg>
    `;

    container.innerHTML = `
      <div class="instruction-subtext">Click the Window button to start</div>
      ${arrowSvg}
    `;

    // OK Button
    const btn = document.createElement("button");
    btn.className = "instruction-button";
    btn.textContent = "Got it!";

    btn.onclick = (e) => {
      this.dismiss();
      e.stopPropagation();
    };

    container.appendChild(btn); // Add button after text/arrow

    // Re-arrange: Text -> Subtext -> Button -> Arrow?
    // Actually, Arrow should be pointing at the button.
    // Let's append arrow last so it's at the bottom pointing down.

    // Clear innerHTML to append strictly
    container.innerHTML = "";

    const subtextDiv = document.createElement("div");
    subtextDiv.className = "instruction-subtext";
    subtextDiv.textContent = "Click the Window button to start";

    // Arrow container
    const arrowDiv = document.createElement("div");
    arrowDiv.className = "instruction-arrow-container";
    arrowDiv.innerHTML = arrowSvg;

    container.appendChild(subtextDiv);
    container.appendChild(btn);
    container.appendChild(arrowDiv);

    this.element.appendChild(container);
    document.body.appendChild(this.element);
  }
}
