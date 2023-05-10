import { KeyMasterService } from './key-master.service';
import {inject, Injectable} from '@angular/core';
import { Container } from './container';

export interface Strategy {
  handleKeyBoardEvent: (keyboardEvent: KeyboardEvent, handled: boolean) => void;
  discoverParentContainers: (
    element: Element | null | undefined
  ) => Container[];
}

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

  bubble = () => new BubbleStrategy(this.#keyMasterService);
  exclusive = () => new ExclusiveStrategy();
  merge = () => new MergeStrategy(this.#keyMasterService);
}

/**
 * Returns only the container itself on discovery.
 * Stops propagation of the keyboard event regardless of whether it got handled.
 */
export class ExclusiveStrategy implements Strategy {
  handleKeyBoardEvent(event: KeyboardEvent, _handled: boolean) {
    event.stopPropagation();
  }

  discoverParentContainers(_element: Element | null | undefined): Container[] {
    return [];
  }
}

/**
 * Returns the parent container on discovery.
 * Propagates the keyboard event bubble if not handled.
 */
export class BubbleStrategy implements Strategy {
  constructor(private keyMasterService: KeyMasterService) {}

  handleKeyBoardEvent(event: KeyboardEvent, handled: boolean) {
    if (handled) {
      event.stopPropagation();
    }
  }

  discoverParentContainers(element: Element | null | undefined): Container[] {
    const nextContainer =
      this.keyMasterService.getParentContainerFromElement(element);
    return nextContainer
      ? nextContainer.discoverParentContainers()
      : [this.keyMasterService.globalContainer];
  }
}

/**
 * Returns the global container on discovery.
 * Forwards the keyboard event to the global container if not handled.
 */
export class MergeStrategy implements Strategy {
  constructor(private keyMasterService: KeyMasterService) {}

  handleKeyBoardEvent(event: KeyboardEvent, handled: boolean) {
    if (!handled) {
      this.keyMasterService.globalContainer.onKeyboardEvent(event);
    }
    event.stopPropagation();
  }

  discoverParentContainers(_element: Element | null | undefined): Container[] {
    return [this.keyMasterService.globalContainer];
  }
}
