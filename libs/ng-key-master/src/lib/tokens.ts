import {InjectionToken} from "@angular/core";
import {Strategy} from "./strategies";
import {VisualizationStrategy} from "./visualizer/visualization-strategies";
import {GlobalContainerConfig, IgnoreTarget} from "./models";

export const DEFAULT_CONTAINER_STRATEGY = new InjectionToken<() => Strategy>('DefaultContainerStrategy'); // return fn instead of value to create a new instance foreach usage

export const DEFAULT_VISUALIZATION_STRATEGY = new InjectionToken<() => VisualizationStrategy>('DefaultVisualizationStrategy'); // return fn instead of value to create a new instance foreach usage

export const DEFAULT_IGNORE_TARGETS = new InjectionToken<IgnoreTarget[]>('DefaultIgnoreTargets');

export const GLOBAL_CONTAINER_CONFIG = new InjectionToken<GlobalContainerConfig>('GlobalContainerConfig');
