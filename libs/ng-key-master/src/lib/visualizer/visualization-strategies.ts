import {inject, Injectable, Injector, Renderer2, RendererFactory2,} from '@angular/core';
import {VisualizationService} from './visualization.service';
import {KeyBinding} from '../models';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {
  KEY_BINDING_OVERLAY_DATA,
  KeyBindingOverlayComponent,
} from './key-binding-overlay/key-binding-overlay.component';
import {ComponentPortal} from '@angular/cdk/portal';

export interface VisualizationStrategy {
  show(): void;

  hide(): void;

  create(keyBinding: KeyBinding): void;

  destroy(): void;
}

export type VisualizationStrategyOption = keyof VisualizationStrategyOptions;

/**
 * Options / Strategies for how an KeyBinding is visualized.
 *
 * This class primarily acts as a factory for VisualizationStrategy instances.
 * Mimics Angular-CDKs architecture for overlay's scroll-strategy: https://github.com/angular/components/blob/main/src/cdk/overlay/scroll/scroll-strategy-options.ts
 */
@Injectable({ providedIn: 'root' })
export class VisualizationStrategyOptions {
  readonly #renderer = inject(RendererFactory2).createRenderer(null, null);
  readonly #overlayService = inject(Overlay);
  readonly #visualizationService = inject(VisualizationService);

  overlay = () =>
    new OverlayVisualizationStrategy(
      this.#overlayService,
      this.#visualizationService
    );
  noop = () => new NoopVisualizationStrategy();
  inline = () => new InlineVisualizationStrategy(this.#renderer);
}

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

/**
 * Textual representation of the key that gets added as a child of the host element.
 * Useful for
 */
export class InlineVisualizationStrategy implements VisualizationStrategy {
  element: HTMLSpanElement = this.renderer.createElement('span');

  constructor(private readonly renderer: Renderer2) {
  }

  show() {
    this.renderer.removeClass(this.element, 'hidden');
  }

  hide() {
    this.renderer.addClass(this.element, 'hidden');
  }

  create(keyBinding: KeyBinding) {
    this.element.textContent = ` (${keyBinding.key})`;
    this.renderer.appendChild(keyBinding.element, this.element);
  }

  destroy() {
    this.renderer.removeChild(this.element.parentElement, this.element);
  }
}

/**
 * Spawns an overlay at the host element showing the key binding.
 */
export class OverlayVisualizationStrategy implements VisualizationStrategy {
  #overlayRef: OverlayRef | undefined;
  #portal = new ComponentPortal(KeyBindingOverlayComponent);

  constructor(
    private overlay: Overlay,
    private visualizationService: VisualizationService
  ) {}

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
      providers: [{ provide: KEY_BINDING_OVERLAY_DATA, useValue: keyBinding }],
    });

    if (this.visualizationService.isOpen) {
      this.show();
    }
  }
}
