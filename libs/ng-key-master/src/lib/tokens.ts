import {inject, InjectionToken, Signal} from "@angular/core";
import {ActiveElement, GlobalContainerConfig, IgnoreTarget} from "./models";
import {DOCUMENT} from "@angular/common";
import {fromEvent, merge} from "rxjs";
import {debounceTime, map} from "rxjs/operators";
import {toSignal} from "@angular/core/rxjs-interop";
import {Strategy} from "./strategies/strategy";
import {VisualizationStrategy} from "./visualizer/strategies/visualization-strategy";


export const DEFAULT_CONTAINER_NAME = new InjectionToken<string>('DefaultContainerName');

export const DEFAULT_CONTAINER_STRATEGY = new InjectionToken<() => Strategy>('DefaultContainerStrategy'); // return fn instead of value to create a new instance foreach usage

export const DEFAULT_VISUALIZATION_STRATEGY = new InjectionToken<() => VisualizationStrategy>('DefaultVisualizationStrategy'); // return fn instead of value to create a new instance foreach usage

export const DEFAULT_IGNORE_TARGETS = new InjectionToken<IgnoreTarget[]>('DefaultIgnoreTargets');

export const GLOBAL_CONTAINER_CONFIG = new InjectionToken<GlobalContainerConfig>('GlobalContainerConfig');

export const ACTIVE_ELEMENT = new InjectionToken<Signal<ActiveElement>>(
  'ACTIVE_ELEMENT',
  {
    providedIn: 'root',
    factory() {
      const doc = inject(DOCUMENT);

      const activeElement$ = merge(
        fromEvent(doc, 'focus', {capture: true}).pipe(map(() => true)),
        fromEvent(doc, 'blur', {capture: true}).pipe(map(() => false))
      ).pipe(
        // switching focus fires blur-event in between -> debounceTime filters this unintended event-fire
        debounceTime(1),
        map(() => doc.activeElement),
      );

      return toSignal(activeElement$, {initialValue: doc.activeElement});
    },
  }
);
