import {Container} from "../container";

import {Strategy} from "./strategy";

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
