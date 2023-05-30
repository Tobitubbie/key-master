import {EnvironmentProviders, makeEnvironmentProviders} from "@angular/core";
import {StrategyOption, StrategyOptions} from "./strategies";
import {
  DEFAULT_CONTAINER_STRATEGY,
  DEFAULT_IGNORE_TARGETS,
  DEFAULT_VISUALIZATION_STRATEGY,
  GLOBAL_CONTAINER_CONFIG
} from "./tokens";
import {VisualizationStrategyOption, VisualizationStrategyOptions} from "./visualizer/visualization-strategies";
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
      deps: [StrategyOptions],
      useFactory: (options: StrategyOptions) => options[config.defaultContainerStrategy],
    },
    {
      provide: DEFAULT_VISUALIZATION_STRATEGY,
      deps: [VisualizationStrategyOptions],
      useFactory: (options: VisualizationStrategyOptions) => options[config.defaultVisualizationStrategy],
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

