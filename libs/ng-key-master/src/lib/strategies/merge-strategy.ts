import {KeyMasterService} from "../key-master.service";
import {Container} from "../container";

import {Strategy} from "./strategy";

/**
 * Returns the global container on discovery.
 * Forwards the keyboard event to the global container if not handled.
 */
export class MergeStrategy implements Strategy {
  constructor(private keyMasterService: KeyMasterService) {
  }

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
