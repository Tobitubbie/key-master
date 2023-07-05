import {VisualizationStrategy} from "./visualization-strategy";
import {KeyBinding} from "../../models";

/**
 * It does nothing, so it has the same behaviour as not setting any strategy at all.
 * Can be useful to prevent key bindings from being displayed, e.g. for global key bindings that exist in the DOM.
 */
export class NoopVisualizationStrategy implements VisualizationStrategy {
  show() {
    /*NOOP*/
  }

  hide() {
    /*NOOP*/
  }

  create(_keyBinding: KeyBinding) {
    /*NOOP*/
  }

  destroy() {
    /*NOOP*/
  }
}
