import {KeyMasterService} from '../key-master.service';
import {inject, Injectable} from '@angular/core';
import {ExclusiveStrategy} from "./exclusive-strategy";
import {MergeStrategy} from "./merge-strategy";
import {BubbleStrategy} from "./bubble-strategy";
import {NoopStrategy} from "./noop-strategy";

export type StrategyOption = keyof StrategyOptions;

/**
 * Options / Strategies for how an KeyboardEvent is processed and how parent containers are discovered.
 *
 * This class primarily acts as a factory for Strategy instances.
 * Mimics Angular-CDKs architecture for overlay's scroll-strategy: https://github.com/angular/components/blob/main/src/cdk/overlay/scroll/scroll-strategy-options.ts
 */
@Injectable({ providedIn: 'root' })
export class StrategyOptions {

  #keyMasterService = inject(KeyMasterService);

  noop = () => new NoopStrategy();
  bubble = () => new BubbleStrategy(this.#keyMasterService);
  exclusive = () => new ExclusiveStrategy();
  merge = () => new MergeStrategy(this.#keyMasterService);
}

