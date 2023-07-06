import {Container} from "../container";

import {Strategy} from "./strategy";

export class NoopStrategy implements Strategy {
  handleKeyBoardEvent(_event: KeyboardEvent, _handled: boolean) {
    /* NOOP */
  }

  discoverParentContainers(_element: Element | null | undefined): Container[] {
    return [];
  }
}
