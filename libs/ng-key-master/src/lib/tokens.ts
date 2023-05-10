import {InjectionToken} from "@angular/core";
import {Strategy} from "./strategies";
import {VisualizationStrategy} from "./visualizer/visualization-strategies";

export const DEFAULT_CONTAINER_STRATEGY = new InjectionToken<() => Strategy>('DefaultContainerStrategy');
export const DEFAULT_VISUALIZATION_STRATEGY = new InjectionToken<() => VisualizationStrategy>('DefaultVisualizationStrategy');
