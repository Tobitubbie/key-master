import {VisualizationStrategy} from './visualizer/visualization-strategies';

export type Shortcut = {
  key: string;
  action: VoidFunction;
  label?: string;
}

export type KeyBinding = Shortcut & (
  // enforces both or none of the properties is set
  { element: Element; strategy: VisualizationStrategy; }
  | { element?: never; strategy?: never; });

export type IgnoreTarget = typeof Element;

export type GlobalContainerConfig = {
  name: string,
  ignoreTargets: IgnoreTarget[],
  element: Element,
}
