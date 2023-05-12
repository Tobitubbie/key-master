import {IgnoreTarget, KeyBinding} from './models';
import {NoopStrategy, Strategy} from './strategies';

export abstract class Container {

  readonly keyBindings: Map<string, KeyBinding> = new Map();

  ignoreTargets: IgnoreTarget[] = [];
  strategy: Strategy = new NoopStrategy();

  name: string | undefined;
  registrationId: string | undefined;
  element: Element | undefined;

  addKeyBinding(keyBinding: KeyBinding): void {
    console.log(
      `[CONTAINER] ${this.registrationId ?? this.name}: Adding KeyBinding ${
        keyBinding.label
      }`
    );
    if (this.keyBindings.has(keyBinding.key)) {
      throw `[CONTAINER] ${this.registrationId ?? 'global'}: Binding for Key ${
        keyBinding.key
      } already exists`;
    } else {
      this.keyBindings.set(keyBinding.key, keyBinding);
    }
  }

  removeKeyBinding(keyBinding: KeyBinding): void {
    console.log(
      `[CONTAINER] ${this.registrationId ?? 'global'}: Removing KeyBinding ${
        keyBinding.label
      }`
    );
    this.keyBindings.delete(keyBinding.key);
  }

  onKeyboardEvent(event: KeyboardEvent): void {
    let handled = false;

    if (
      !this.ignoreTargets.some(
        (ignoreTarget) => event.target instanceof ignoreTarget
      )
    ) {
      const keyBinding = this.keyBindings.get(event.key);

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
