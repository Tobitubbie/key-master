import {InjectionToken} from "@angular/core";
import {Strategy} from "./strategies";
import {VisualizationStrategy} from "./visualizer/visualization-strategies";
import {GlobalContainerConfig, IgnoreTarget} from "./models";

export const DEFAULT_CONTAINER_STRATEGY = new InjectionToken<() => Strategy>('DefaultContainerStrategy');
export const DEFAULT_VISUALIZATION_STRATEGY = new InjectionToken<() => VisualizationStrategy>('DefaultVisualizationStrategy');
export const DEFAULT_IGNORE_TARGETS = new InjectionToken<IgnoreTarget[]>('DefaultIgnoreTargets');

export const GLOBAL_CONTAINER_CONFIG = new InjectionToken<GlobalContainerConfig>('GlobalContainerConfig');
