import {KeyMasterService} from "../key-master.service";
import {Container} from "../container";

import {Strategy} from "./strategy";

/**
 * Returns the parent container on discovery.
 * Propagates the keyboard event bubble if not handled.
 */
export class BubbleStrategy implements Strategy {
  constructor(private keyMasterService: KeyMasterService) {
  }

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
