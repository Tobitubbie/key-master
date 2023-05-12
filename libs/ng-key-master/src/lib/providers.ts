import {EnvironmentProviders, inject, makeEnvironmentProviders} from "@angular/core";
import {Strategy, StrategyOption, StrategyOptions} from "./strategies";
import {
  DEFAULT_CONTAINER_STRATEGY,
  DEFAULT_IGNORE_TARGETS,
  DEFAULT_VISUALIZATION_STRATEGY,
  GLOBAL_CONTAINER_CONFIG
} from "./tokens";
import {
  VisualizationStrategy,
  VisualizationStrategyOption,
  VisualizationStrategyOptions
} from "./visualizer/visualization-strategies";
import {GlobalContainerConfig, IgnoreTarget} from "./models";


export interface KeyMasterConfig {
  defaultContainerStrategy?: StrategyOption;
  defaultVisualizationStrategy?: VisualizationStrategyOption;
  defaultIgnoreTargets?: IgnoreTarget[];
  globalContainerConfig?: Partial<GlobalContainerConfig>;
}

export const defaultConfig: Required<KeyMasterConfig> = {
  defaultContainerStrategy: 'bubble',
  defaultVisualizationStrategy: 'overlay',
  defaultIgnoreTargets: [HTMLInputElement, HTMLTextAreaElement],
  globalContainerConfig: {
    name: 'Global',
    element: document.documentElement,
    ignoreTargets: [],
  }
}


export function provideKeyMaster(userConfig: KeyMasterConfig = {}): EnvironmentProviders {

  const config: Required<KeyMasterConfig> = {
    ...defaultConfig, ...userConfig,
    globalContainerConfig: {...defaultConfig.globalContainerConfig, ...userConfig.globalContainerConfig}
  };

  return makeEnvironmentProviders([
    {
      provide: DEFAULT_CONTAINER_STRATEGY,
      useValue: () => createContainerStrategy(config.defaultContainerStrategy), // return fn instead of value to create a new instance foreach usage
    },
    {
      provide: DEFAULT_VISUALIZATION_STRATEGY,
      useValue: () => createVisualizationStrategy(config.defaultVisualizationStrategy), // return fn instead of value to create a new instance foreach usage
    },
    {
      provide: DEFAULT_IGNORE_TARGETS,
      useValue: config.defaultIgnoreTargets,
    },
    {
      provide: GLOBAL_CONTAINER_CONFIG,
      useValue: config.globalContainerConfig,
    },
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

