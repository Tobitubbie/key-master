import {VisualizationStrategy} from "./visualization-strategy";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {
  KEY_BINDING_OVERLAY_DATA,
  KeyBindingOverlayComponent
} from "../key-binding-overlay/key-binding-overlay.component";
import {KeyBinding} from "../../models";
import {Injector} from "@angular/core";

/**
 * Spawns an overlay at the host element showing the key binding.
 */
export class OverlayVisualizationStrategy implements VisualizationStrategy {
  #overlayRef: OverlayRef | undefined;
  #portal = new ComponentPortal(KeyBindingOverlayComponent);

  constructor(
    private overlay: Overlay,
  ) {
  }

  hide() {
    if (this.#portal.isAttached) {
      this.#portal.detach();
    }
  }

  show() {
    if (!this.#portal.isAttached && this.#overlayRef) {
      this.#portal.attach(this.#overlayRef);
    }
  }

  destroy() {
    this.#overlayRef?.dispose();
    this.#overlayRef = undefined;
  }

  create(keyBinding: KeyBinding) {
    if (!keyBinding.element) {
      throw '[OVERLAY_VISUALIZATION_STRATEGY] Creation failed due to missing property "element"';
    }

    // skip if host already spawned
    if (!this.#overlayRef) {
      this.#overlayRef = this.overlay.create({
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(keyBinding.element)
          .setOrigin(keyBinding.element)
          .withPositions([
            {
              originX: 'center',
              originY: 'top',
              overlayX: 'center',
              overlayY: 'bottom',
            },
          ])
          .withPush(false),
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
      });
    }

    this.#portal.injector = Injector.create({
      providers: [{provide: KEY_BINDING_OVERLAY_DATA, useValue: keyBinding}],
    });
  }
}
