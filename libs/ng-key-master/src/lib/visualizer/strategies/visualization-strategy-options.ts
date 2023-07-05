import {inject, Injectable, RendererFactory2,} from '@angular/core';
import {Overlay} from '@angular/cdk/overlay';
import {NoopVisualizationStrategy} from "./noop-visualization-strategy";
import {OverlayVisualizationStrategy} from "./overlay-visualization-strategy";
import {InlineVisualizationStrategy} from "./inline-visualization-strategy";

export type VisualizationStrategyOption = keyof VisualizationStrategyOptions;

/**
 * Options / Strategies for how an KeyBinding is visualized.
 *
 * This class primarily acts as a factory for VisualizationStrategy instances.
 * Mimics Angular-CDKs architecture for overlay's scroll-strategy: https://github.com/angular/components/blob/main/src/cdk/overlay/scroll/scroll-strategy-options.ts
 */
@Injectable({providedIn: 'root'})
export class VisualizationStrategyOptions {
  readonly #renderer = inject(RendererFactory2).createRenderer(null, null);
  readonly #overlayService = inject(Overlay);

  overlay = () =>
    new OverlayVisualizationStrategy(this.#overlayService);
  noop = () => new NoopVisualizationStrategy();
  inline = () => new InlineVisualizationStrategy(this.#renderer);
}

