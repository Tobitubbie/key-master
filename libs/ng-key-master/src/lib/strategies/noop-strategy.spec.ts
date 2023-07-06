import {NoopStrategy} from "./noop-strategy";


describe('NoopStrategy', () => {

  let strategy: NoopStrategy;

  beforeEach(() => {
    strategy = new NoopStrategy();
  });

  it('should always stop event propagation', () => {
    const event = new KeyboardEvent('keydown', {bubbles: true});
    const spy = jest.spyOn(event, 'stopPropagation');
    strategy.handleKeyBoardEvent(event, true);
    strategy.handleKeyBoardEvent(event, false);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should always return an empty array on discovery', () => {
    expect(strategy.discoverParentContainers(null)).toEqual([]);
    expect(strategy.discoverParentContainers(undefined)).toEqual([]);
  });

});
