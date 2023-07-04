import {Container} from "../container";

export interface Strategy {
  handleKeyBoardEvent: (keyboardEvent: KeyboardEvent, handled: boolean) => void;
  discoverParentContainers: (
    element: Element | null | undefined
  ) => Container[];
}
