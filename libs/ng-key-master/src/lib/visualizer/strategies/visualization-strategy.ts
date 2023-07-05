import {KeyBinding} from "../../models";

export interface VisualizationStrategy {
  show(): void;

  hide(): void;

  create(keyBinding: KeyBinding): void;

  destroy(): void;
}
