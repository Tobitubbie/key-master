import {EnvironmentProviders, inject, makeEnvironmentProviders} from "@angular/core";
import {Strategy, StrategyOption, StrategyOptions} from "./strategies";
import {DEFAULT_CONTAINER_STRATEGY, DEFAULT_VISUALIZATION_STRATEGY} from "./tokens";
import {
  VisualizationStrategy,
  VisualizationStrategyOption,
  VisualizationStrategyOptions
} from "./visualizer/visualization-strategies";

const defaultConfig: KeyMasterConfig = {
  defaultContainerStrategy: 'bubble',
  defaultVisualizationStrategy: 'overlay',
}

export interface KeyMasterConfig {
  defaultContainerStrategy: StrategyOption;
  defaultVisualizationStrategy: VisualizationStrategyOption;
  // globalContainer: Container
}

export function provideKeyMaster(config: Partial<KeyMasterConfig> = {}): EnvironmentProviders {

  const kmConfig = {...defaultConfig, ...config};

  return makeEnvironmentProviders([
    {
      provide: DEFAULT_CONTAINER_STRATEGY,
      useValue: () => containerStrategy(kmConfig.defaultContainerStrategy), // useValue with arrow-fn to create new instance foreach usage (see type in token.ts)
    },
    {
      provide: DEFAULT_VISUALIZATION_STRATEGY,
      useValue: () => visualizationStrategy(kmConfig.defaultVisualizationStrategy), // useValue with arrow-fn to create new instance foreach usage (see type in token.ts)
    },
  ]);
}

function containerStrategy(option: StrategyOption): Strategy {
  const strategyOptions = inject(StrategyOptions);
  return strategyOptions[option]();
}

function visualizationStrategy(option: VisualizationStrategyOption): VisualizationStrategy {
  const visualizationOptions = inject(VisualizationStrategyOptions);
  return visualizationOptions[option]();
}

