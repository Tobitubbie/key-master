import {EnvironmentProviders, makeEnvironmentProviders} from "@angular/core";
import {Strategy} from './strategies/strategy';
import {StrategyOption, StrategyOptions} from "./strategies/strategy-options";
import {
  DEFAULT_CONTAINER_NAME,
  DEFAULT_CONTAINER_STRATEGY,
  DEFAULT_IGNORE_TARGETS,
  DEFAULT_VISUALIZATION_STRATEGY,
  GLOBAL_CONTAINER_CONFIG
} from "./tokens";
import {VisualizationStrategyOption, VisualizationStrategyOptions} from "./visualizer/strategies/visualization-strategy-options";
import {IgnoreTarget} from "./models";


export type KeyMasterConfig = {
  defaultContainerName?: string;
  defaultContainerStrategy?: StrategyOption;
  defaultVisualizationStrategy?: VisualizationStrategyOption;
  defaultIgnoreTargets?: IgnoreTarget[];
  globalContainerConfig?: Partial<GlobalContainerConfig>;
}

export type GlobalContainerConfig = {
  name: string,
  ignoreTargets: IgnoreTarget[],
  element: Element,
}

export const defaultConfig: Required<KeyMasterConfig> = {
  defaultContainerName: 'Others',
  defaultContainerStrategy: 'merge',
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
    ...defaultConfig,
    ...userConfig,

    globalContainerConfig: {
      ...defaultConfig.globalContainerConfig,
      ...userConfig.globalContainerConfig
    }
  };

  return makeEnvironmentProviders([
    {
      provide: DEFAULT_CONTAINER_NAME,
      useValue: config.defaultContainerName,
    },
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
