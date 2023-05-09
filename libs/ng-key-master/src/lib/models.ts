import { VisualizationStrategy } from './visualizer/visualization-strategies';

// TODO: typify real keys
export type Key = string;

export type KeyBinding = {
  key: Key;
  action: VoidFunction;
  label?: string;
  element?: Element;
  strategy?: VisualizationStrategy;
};

export type IgnoreTarget = typeof Element;
