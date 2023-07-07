import {TestBed} from "@angular/core/testing";
import {StrategyOptions} from "./strategy-options";
import {ExclusiveStrategy} from "./exclusive-strategy";
import {BubbleStrategy} from "./bubble-strategy";
import {MergeStrategy} from "./merge-strategy";
import {NoopStrategy} from "./noop-strategy";
import {provideKeyMaster} from "../providers";

describe('StrategyOptions', () => {

  let strategyOptions: StrategyOptions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideKeyMaster(),
      ],
    });
    strategyOptions = TestBed.inject(StrategyOptions);
  });

  it('should create', () => {
    expect(strategyOptions).toBeDefined();
  });

  it('should return a NoopStrategy', () => {
    expect(strategyOptions.noop()).toBeInstanceOf(NoopStrategy);
  });

  it('should return a MergeStrategy', () => {
    expect(strategyOptions.merge()).toBeInstanceOf(MergeStrategy);
  });

  it('should return a BubbleStrategy', () => {
    expect(strategyOptions.bubble()).toBeInstanceOf(BubbleStrategy);
  });

  it('should return an ExclusiveStrategy', () => {
    expect(strategyOptions.exclusive()).toBeInstanceOf(ExclusiveStrategy);
  });

});
