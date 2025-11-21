/**
 * Selection Manager - Handles element selection in preview canvas
 */

import type { SelectionState, ElementBounds } from '../types';

// ============================================================================
// Selection Manager Class
// ============================================================================

export class SelectionManager {
  private state: SelectionState = {
    selectedId: null,
    hoveredId: null,
    highlightedIds: [],
  };

  private iframe: HTMLIFrameElement | null = null;
  private overlay: HTMLElement | null = null;
  private listeners: Map<string, (state: SelectionState) => void> = new Map();

  /**
   * Attach to preview iframe
   */
  attachToPreview(iframe: HTMLIFrameElement): void {
    this.iframe = iframe;

    // Wait for iframe to load
    iframe.addEventListener('load', () => {
      this.setupInteractions();
    });

    // If already loaded
    if (iframe.contentDocument?.readyState === 'complete') {
      this.setupInteractions();
    }
  }

  /**
   * Setup click and hover interactions
   */
  private setupInteractions(): void {
    if (!this.iframe?.contentDocument) return;

    const doc = this.iframe.contentDocument;

    // Create overlay for highlights
    this.createOverlay(doc);

    // Add click handler
    doc.addEventListener('click', this.handleClick.bind(this), true);

    // Add hover handlers
    doc.addEventListener('mouseover', this.handleMouseOver.bind(this), true);
    doc.addEventListener('mouseout', this.handleMouseOut.bind(this), true);
  }

  /**
   * Create selection overlay
   */
  private createOverlay(doc: Document): void {
    // Remove existing overlay
    const existing = doc.getElementById('selection-overlay');
    if (existing) {
      existing.remove();
    }

    // Create new overlay
    const overlay = doc.createElement('div');
    overlay.id = 'selection-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
    `;

    doc.body.appendChild(overlay);
    this.overlay = overlay;
  }

  /**
   * Handle element click
   */
  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Get element ID
    const elementId = target.getAttribute('data-element-id');
    if (!elementId) return;

    // Prevent default behavior
    event.preventDefault();
    event.stopPropagation();

    // Update selection
    this.state.selectedId = elementId;
    this.state.hoveredId = null;

    // Highlight element
    this.highlightElement(elementId, 'selected');

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Handle mouse over
   */
  private handleMouseOver(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Get element ID
    const elementId = target.getAttribute('data-element-id');
    if (!elementId || elementId === this.state.selectedId) return;

    // Update hover state
    this.state.hoveredId = elementId;

    // Highlight element
    this.highlightElement(elementId, 'hovered');

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Handle mouse out
   */
  private handleMouseOut(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const elementId = target.getAttribute('data-element-id');

    if (elementId === this.state.hoveredId) {
      this.state.hoveredId = null;
      this.clearHoverHighlight();
      this.notifyListeners();
    }
  }

  /**
   * Highlight element with overlay
   */
  highlightElement(elementId: string, type: 'selected' | 'hovered'): void {
    if (!this.iframe?.contentDocument || !this.overlay) return;

    const element = this.iframe.contentDocument.querySelector(
      `[data-element-id="${elementId}"]`
    ) as HTMLElement;

    if (!element) return;

    const bounds = this.getElementBounds(element);

    // Clear previous highlights of this type
    if (type === 'selected') {
      this.clearSelection();
    } else {
      this.clearHoverHighlight();
    }

    // Create highlight box
    const box = this.createHighlightBox(bounds, type);
    this.overlay.appendChild(box);
  }

  /**
   * Create highlight box element
   */
  private createHighlightBox(
    bounds: Omit<ElementBounds, 'id' | 'element'>,
    type: 'selected' | 'hovered'
  ): HTMLElement {
    const box = document.createElement('div');

    const color = type === 'selected' ? '#3b82f6' : '#8b5cf6';
    const bgOpacity = type === 'selected' ? '0.1' : '0.05';

    box.className = `highlight-box-${type}`;
    box.style.cssText = `
      position: absolute;
      left: ${bounds.x}px;
      top: ${bounds.y}px;
      width: ${bounds.width}px;
      height: ${bounds.height}px;
      border: 2px solid ${color};
      background: ${color}${bgOpacity === '0.1' ? '1a' : '0d'};
      pointer-events: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
    `;

    // Add label for selected elements
    if (type === 'selected') {
      const label = document.createElement('div');
      label.style.cssText = `
        position: absolute;
        top: -24px;
        left: -2px;
        background: ${color};
        color: white;
        padding: 2px 8px;
        font-size: 12px;
        font-family: system-ui, sans-serif;
        border-radius: 4px 4px 0 0;
        font-weight: 500;
      `;
      label.textContent = 'Selected';
      box.appendChild(label);
    }

    return box;
  }

  /**
   * Get element bounds
   */
  private getElementBounds(element: HTMLElement): Omit<ElementBounds, 'id' | 'element'> {
    const rect = element.getBoundingClientRect();

    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }

  /**
   * Clear selection highlight
   */
  private clearSelection(): void {
    if (!this.overlay) return;

    const boxes = this.overlay.querySelectorAll('.highlight-box-selected');
    boxes.forEach(box => box.remove());
  }

  /**
   * Clear hover highlight
   */
  private clearHoverHighlight(): void {
    if (!this.overlay) return;

    const boxes = this.overlay.querySelectorAll('.highlight-box-hovered');
    boxes.forEach(box => box.remove());
  }

  /**
   * Clear all highlights
   */
  clearAllHighlights(): void {
    if (!this.overlay) return;
    this.overlay.innerHTML = '';
  }

  /**
   * Deselect current element
   */
  deselect(): void {
    this.state.selectedId = null;
    this.clearSelection();
    this.notifyListeners();
  }

  /**
   * Get current selection state
   */
  getState(): SelectionState {
    return { ...this.state };
  }

  /**
   * Subscribe to selection changes
   */
  subscribe(id: string, callback: (state: SelectionState) => void): void {
    this.listeners.set(id, callback);
  }

  /**
   * Unsubscribe from selection changes
   */
  unsubscribe(id: string): void {
    this.listeners.delete(id);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      callback(this.getState());
    });
  }

  /**
   * Destroy and cleanup
   */
  destroy(): void {
    if (this.overlay) {
      this.overlay.remove();
    }

    this.iframe = null;
    this.overlay = null;
    this.listeners.clear();
  }
}

// ============================================================================
// Export
// ============================================================================

export const createSelectionManager = () => new SelectionManager();
