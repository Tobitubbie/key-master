import {TestBed} from "@angular/core/testing";
import {VisualizationStrategyOptions} from "./visualization-strategy-options";
import {NoopVisualizationStrategy} from "./noop-visualization-strategy";
import {InlineVisualizationStrategy} from "./inline-visualization-strategy";
import {OverlayVisualizationStrategy} from "./overlay-visualization-strategy";

describe('VisualizationStrategyOptions', () => {

  let strategyOptions: VisualizationStrategyOptions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisualizationStrategyOptions],
    });
    strategyOptions = TestBed.inject(VisualizationStrategyOptions);
  });

  it('should create', () => {
    expect(strategyOptions).toBeDefined();
  });

  it('should return a NoopVisualizationStrategy', () => {
    expect(strategyOptions.noop()).toBeInstanceOf(NoopVisualizationStrategy);
  });

  it('should return an InlineVisualizationStrategy', () => {
    expect(strategyOptions.inline()).toBeInstanceOf(InlineVisualizationStrategy);
  });

  it('should return an OverlayVisualizationStrategy', () => {
    expect(strategyOptions.overlay()).toBeInstanceOf(OverlayVisualizationStrategy);
  });

});
