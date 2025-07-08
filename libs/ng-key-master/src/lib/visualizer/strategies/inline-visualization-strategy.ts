import {VisualizationStrategy} from "./visualization-strategy";
import {Renderer2} from "@angular/core";
import {KeyBinding} from "../../models";
import {symbolizeKeycode} from "../../keycode/symbolizeKey.pipe";

/**
 * Textual representation of the key that gets added as a child of the host element.
 */
export class InlineVisualizationStrategy implements VisualizationStrategy {
  element: HTMLSpanElement = this.renderer.createElement('span');
  keyBindings = <Array<KeyBinding>>[];

  constructor(private readonly renderer: Renderer2) {
  }

  show() {
    this.renderer.removeClass(this.element, 'hidden');
  }

  hide() {
    this.renderer.addClass(this.element, 'hidden');
  }

  create(keyBinding: KeyBinding) {
    if (this.keyBindings.some(kb => kb === keyBinding)) {
      // NOOP - keyBinding is already visualized
      return;
    }

    // Memorize keyBinding
    this.keyBindings.push(keyBinding);

    // Visualize keybinding
    const transformedKey = symbolizeKeycode(keyBinding.key);
    this.element.textContent += ` (${transformedKey})`;
    this.renderer.appendChild(keyBinding.element, this.element);
  }

  destroy() {
    this.keyBindings = [];
    this.renderer.removeChild(this.element.parentElement, this.element);
  }
}
