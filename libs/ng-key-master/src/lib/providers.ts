import {EnvironmentProviders, inject, makeEnvironmentProviders} from "@angular/core";
import {Strategy, StrategyOption, StrategyOptions} from "./strategies";
import {DEFAULT_CONTAINER_STRATEGY, DEFAULT_VISUALIZATION_STRATEGY, GLOBAL_CONTAINER} from "./tokens";
import {
  VisualizationStrategy,
  VisualizationStrategyOption,
  VisualizationStrategyOptions
} from "./visualizer/visualization-strategies";
import {Container} from "./container";

const defaultConfig: KeyMasterConfig = {
  defaultContainerStrategy: 'bubble',
  defaultVisualizationStrategy: 'overlay',
  globalContainer: () => new Container('Global', document.documentElement),
}

export interface KeyMasterConfig {
  defaultContainerStrategy: StrategyOption;
  defaultVisualizationStrategy: VisualizationStrategyOption;
  globalContainer: () => Container;
}

export function provideKeyMaster(config: Partial<KeyMasterConfig> = {}): EnvironmentProviders {

  const kmConfig = {...defaultConfig, ...config};

  return makeEnvironmentProviders([
    {
      provide: DEFAULT_CONTAINER_STRATEGY,
      useValue: () => createContainerStrategy(kmConfig.defaultContainerStrategy), // return fn instead of value to create a new instance foreach usage
    },
    {
      provide: DEFAULT_VISUALIZATION_STRATEGY,
      useValue: () => createVisualizationStrategy(kmConfig.defaultVisualizationStrategy), // return fn instead of value to create a new instance foreach usage
    },
    {
      provide: GLOBAL_CONTAINER,
      useValue: kmConfig.globalContainer(), // return fn instead of value -> prevents creation of two container (overwrite and default)
    }
  ]);
}

function createContainerStrategy(option: StrategyOption): Strategy {
  const strategyOptions = inject(StrategyOptions);
  return strategyOptions[option]();
}

function createVisualizationStrategy(option: VisualizationStrategyOption): VisualizationStrategy {
  const visualizationOptions = inject(VisualizationStrategyOptions);
  return visualizationOptions[option]();
}

