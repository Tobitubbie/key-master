import {MergeStrategy} from "./merge-strategy";
import {KeyMasterService} from "../key-master.service";
import {Container} from "../container";


describe('MergeStrategy', () => {

  let strategy: MergeStrategy;
  let keyMasterServiceMock: KeyMasterService;

  beforeEach(() => {
    keyMasterServiceMock = {
      globalContainer: {
        onKeyboardEvent: jest.fn()
      } as Partial<Container> as Container
    } as KeyMasterService;

    strategy = new MergeStrategy(keyMasterServiceMock);
  });

  it('should return global container on discovery', () => {
    const containers = strategy.discoverParentContainers(null);
    expect(containers).toEqual([keyMasterServiceMock.globalContainer]);
  });

  it('should not forward keyboard event to global container if handled', () => {
    const event = new KeyboardEvent('keydown');
    strategy.handleKeyBoardEvent(event, true);
    expect(keyMasterServiceMock.globalContainer.onKeyboardEvent).not.toHaveBeenCalled();
  });

  it('should forward keyboard event to global container if not handled', () => {
    const event = new KeyboardEvent('keydown');
    strategy.handleKeyBoardEvent(event, false);
    expect(keyMasterServiceMock.globalContainer.onKeyboardEvent).toHaveBeenCalledWith(event);
  });

  it('should always stop event propagation', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    parent.appendChild(child);

    const parentListener = jest.fn();
    const handledListener = jest.fn((event: KeyboardEvent) => {
      const spy = jest.spyOn(event, 'stopPropagation');
      strategy.handleKeyBoardEvent(event, true);
      expect(spy).toHaveBeenCalled();
    });
    const unhandledListener = jest.fn((event: KeyboardEvent) => {
      const spy = jest.spyOn(event, 'stopPropagation');
      strategy.handleKeyBoardEvent(event, false);
      expect(spy).toHaveBeenCalled();
    });

    parent.addEventListener('keydown', parentListener);
    child.addEventListener('keydown', handledListener);
    child.addEventListener('keydown', unhandledListener);

    child.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true}));

    expect(parentListener).not.toHaveBeenCalled();
    expect(handledListener).toHaveBeenCalled();
    expect(unhandledListener).toHaveBeenCalled();
  });

});
