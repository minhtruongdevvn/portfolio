/**
 * IframeViewer Component - Iframe content viewer window
 * Extends Window to display external content in an iframe
 */

import { Window, WindowConfig } from './Window.js';

/**
 * Configuration for IframeViewer window
 */
export interface IframeViewerConfig extends WindowConfig {
  /** URL to display in the iframe */
  url: string;
}

/**
 * IframeViewer - Displays external content in an iframe
 */
export class IframeViewer extends Window {
  private url: string;
  private iframe: HTMLIFrameElement | null;

  constructor(config: IframeViewerConfig) {
    super(config);
    this.url = config.url;
    this.iframe = null;
  }

  /**
   * Renders the iframe viewer window with embedded content
   */
  render(): HTMLElement {
    const element = super.render();

    if (this.contentContainer) {
      // Clear content container
      this.contentContainer.innerHTML = '';

      // Remove default scrollbar from window content container
      this.contentContainer.style.overflow = 'hidden';

      // Create iframe
      this.iframe = document.createElement('iframe');
      this.iframe.className = 'iframe-viewer__frame';
      this.iframe.src = this.url;
      this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
      this.iframe.style.width = '100%';
      this.iframe.style.height = '100%';
      this.iframe.style.border = 'none';

      this.contentContainer.appendChild(this.iframe);
    }

    return element;
  }

  /**
   * Cleans up the iframe viewer window
   */
  destroy(): void {
    if (this.iframe) {
      this.iframe.src = '';
      this.iframe = null;
    }
    super.destroy();
  }
}
