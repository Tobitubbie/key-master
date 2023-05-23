import {IgnoreTarget, KeyBinding} from './models';
import {NoopStrategy, Strategy} from './strategies';
import {keycodeMatchesEvent} from "./keycode/keycode";

export abstract class Container {

  readonly keyBindings: Map<string, KeyBinding> = new Map();

  ignoreTargets: IgnoreTarget[] = [];
  strategy: Strategy = new NoopStrategy();

  name: string | undefined;
  element: Element | undefined;

  addKeyBinding(keyBinding: KeyBinding): void {
    console.log(`[CONTAINER] ${this.name ?? 'unnamed'}: Adding KeyBinding ${keyBinding.label}`);
    if (this.keyBindings.has(keyBinding.key)) {
      throw `[CONTAINER] ${this.name ?? 'unnamed'}: Binding for Key ${keyBinding.key} already exists`;
    } else {
      this.keyBindings.set(keyBinding.key, keyBinding);
    }
  }

  removeKeyBinding(keyBinding: KeyBinding): void {
    console.log(`[CONTAINER] ${this.name ?? 'unnamed'}: Removing KeyBinding ${keyBinding.label}`);
    this.keyBindings.delete(keyBinding.key);
  }

  onKeyboardEvent(event: KeyboardEvent): void {
    let handled = false;

    if (!this.ignoreTargets.some((ignoreTarget) =>
      event.target instanceof ignoreTarget)
    ) {

      let keyBinding: KeyBinding | undefined = undefined;
      for (const key of this.keyBindings.keys()) {
        if (keycodeMatchesEvent(key, event)) {
          keyBinding = this.keyBindings.get(key);
          break;
        }
      }

      if (keyBinding) {
        keyBinding.action();
        handled = true;
      }
    }

    this.strategy.handleKeyBoardEvent(event, handled);
  }

  discoverParentContainers(): Container[] {
    const parents = this.strategy.discoverParentContainers(this.element);
    return parents ? [...parents, this] : [this];
  }
}
