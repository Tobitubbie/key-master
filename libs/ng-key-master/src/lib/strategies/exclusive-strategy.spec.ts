import {ExclusiveStrategy} from "./exclusive-strategy";


describe('ExclusiveStrategy', () => {

  let strategy: ExclusiveStrategy;

  beforeEach(() => {
    strategy = new ExclusiveStrategy();
  });

  it('should always bubble event', () => {
    const event = new KeyboardEvent('keydown', {bubbles: true});
    const spy = jest.spyOn(event, 'stopPropagation');
    strategy.handleKeyBoardEvent(event, true);
    strategy.handleKeyBoardEvent(event, false);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should always return an empty array on discovery', () => {
    expect(strategy.discoverParentContainers(null)).toEqual([]);
    expect(strategy.discoverParentContainers(undefined)).toEqual([]);
  });

});
