import {KeyMasterService} from "../key-master.service";
import {Container} from "../container";
import {BubbleStrategy} from "./bubble-strategy";


describe('BubbleStrategy', () => {

  let strategy: BubbleStrategy;
  let keyMasterServiceMock: KeyMasterService;

  beforeEach(() => {
    keyMasterServiceMock = {
      globalContainer: {},
      getParentContainerFromElement: _element => undefined,
    } as KeyMasterService;

    strategy = new BubbleStrategy(keyMasterServiceMock);
  });

  describe('Event Handling', () => {

    let parent: HTMLElement;
    let child: HTMLElement;

    let parentListener: jest.Mock;
    let childListener: jest.Mock;

    beforeEach(() => {
      parent = document.createElement('div');
      child = document.createElement('div');
      parent.appendChild(child);

      parentListener = jest.fn();
      childListener = jest.fn();

      parent.addEventListener('keydown', parentListener);
      child.addEventListener('keydown', childListener);
    });

    it('should stop event propagation if handled', () => {
      childListener.mockImplementation(event => {
        const spy = jest.spyOn(event, 'stopPropagation');
        strategy.handleKeyBoardEvent(event, true);
        expect(spy).toHaveBeenCalled();
      });

      child.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true}));

      expect(parentListener).not.toHaveBeenCalled();
      expect(childListener).toHaveBeenCalled();
    });

    it('should bubble event if not handled', () => {
      childListener.mockImplementation(event => {
        const spy = jest.spyOn(event, 'stopPropagation');
        strategy.handleKeyBoardEvent(event, false);
        expect(spy).not.toHaveBeenCalled();
      });

      child.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true}));

      expect(parentListener).toHaveBeenCalled();
      expect(childListener).toHaveBeenCalled();
    });

  });

  describe('Container Discovery', () => {

    it('should return global container if no parent container is found', () => {
      jest.spyOn(keyMasterServiceMock, 'getParentContainerFromElement')
        .mockReturnValue(undefined);
      const containers = strategy.discoverParentContainers(null);
      expect(containers).toEqual([keyMasterServiceMock.globalContainer])
    });

    it('should call discovery of parent container', () => {
      const parentContainer: Partial<Container> = {
        discoverParentContainers: jest.fn(),
        element: document.createElement('div'),
      };
      jest.spyOn(keyMasterServiceMock, 'getParentContainerFromElement')
        .mockReturnValue(parentContainer as Container);

      strategy.discoverParentContainers(parentContainer.element);

      expect(parentContainer.discoverParentContainers).toHaveBeenCalled();
    });

  });

});
