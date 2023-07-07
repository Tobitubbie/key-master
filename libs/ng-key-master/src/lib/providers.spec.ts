import {TestBed} from "@angular/core/testing";
import {defaultConfig, provideKeyMaster} from "./providers";
import {
  DEFAULT_CONTAINER_STRATEGY,
  DEFAULT_IGNORE_TARGETS,
  DEFAULT_VISUALIZATION_STRATEGY,
  GLOBAL_CONTAINER_CONFIG
} from "./tokens";
import {VisualizationStrategyOptions} from "./visualizer/strategies/visualization-strategy-options";
import {StrategyOptions} from "./strategies/strategy-options";

describe('Providers', () => {

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('should provide defaults', () => {
    TestBed.configureTestingModule({
      providers: [
        provideKeyMaster(),
      ]
    });

    const visualizationOptions = TestBed.inject(VisualizationStrategyOptions);
    const strategyOptions = TestBed.inject(StrategyOptions);

    expect(TestBed.inject(GLOBAL_CONTAINER_CONFIG)).toEqual(defaultConfig.globalContainerConfig);
    expect(TestBed.inject(DEFAULT_IGNORE_TARGETS)).toEqual(defaultConfig.defaultIgnoreTargets);
    expect(TestBed.inject(DEFAULT_VISUALIZATION_STRATEGY)).toEqual(visualizationOptions[defaultConfig.defaultVisualizationStrategy]);
    expect(TestBed.inject(DEFAULT_CONTAINER_STRATEGY)).toEqual(strategyOptions[defaultConfig.defaultContainerStrategy]);
  });

  it('should merge (nested) config with defaults', () => {
    TestBed.configureTestingModule({
      providers: [
        provideKeyMaster({
          defaultIgnoreTargets: [HTMLButtonElement],
          globalContainerConfig: {
            name: 'TestGlobalContainer',
          }
        }),
      ]
    });

    const expectedGlobalContainerConfig = {
      ...defaultConfig.globalContainerConfig,
      name: 'TestGlobalContainer',
    };
    const expectedDefaultIgnoreTargets = [HTMLButtonElement];

    expect(TestBed.inject(GLOBAL_CONTAINER_CONFIG)).toEqual(expectedGlobalContainerConfig);
    expect(TestBed.inject(DEFAULT_IGNORE_TARGETS)).toEqual(expectedDefaultIgnoreTargets);
  });

});
