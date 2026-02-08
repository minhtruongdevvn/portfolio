/**
 * TextEditor Component - Text editor window
 * Extends Window to provide text editing capabilities
 */

import { Window, WindowConfig } from './Window.js';

/**
 * Configuration for TextEditor window
 */
export interface TextEditorConfig extends WindowConfig {
  /** Initial text content */
  initialText?: string;
  /** Whether the editor is read-only */
  readOnly?: boolean;
}

/**
 * TextEditor - Simple text editing window
 */
export class TextEditor extends Window {
  private textarea: HTMLTextAreaElement | null;
  private readOnly: boolean;

  constructor(config: TextEditorConfig) {
    super(config);
    this.textarea = null;
    this.readOnly = config.readOnly || false;
  }

  /**
   * Renders the text editor window with textarea
   */
  render(): HTMLElement {
    const element = super.render();

    if (this.contentContainer) {
      // Clear content container
      this.contentContainer.innerHTML = '';

      // Create textarea
      this.textarea = document.createElement('textarea');
      this.textarea.className = 'text-editor__textarea';
      this.textarea.value = (this as any).config.initialText || '';
      this.textarea.readOnly = this.readOnly;
      this.textarea.style.width = '100%';
      this.textarea.style.height = '100%';
      this.textarea.style.border = 'none';
      this.textarea.style.padding = '8px';
      this.textarea.style.fontFamily = 'Consolas, monospace';
      this.textarea.style.fontSize = '14px';
      this.textarea.style.resize = 'none';
      this.textarea.style.outline = 'none';

      this.contentContainer.appendChild(this.textarea);
    }

    return element;
  }

  /**
   * Gets the current text content
   */
  getText(): string {
    return this.textarea?.value || '';
  }

  /**
   * Sets the text content
   */
  setText(text: string): void {
    if (this.textarea) {
      this.textarea.value = text;
    }
  }

  /**
   * Cleans up the text editor window
   */
  destroy(): void {
    this.textarea = null;
    super.destroy();
  }
}
