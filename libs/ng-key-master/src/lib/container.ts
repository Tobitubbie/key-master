import { DEFAULT_IGNORE_TARGETS } from './utils';
import { IgnoreTarget, KeyBinding } from './models';
import { ExclusiveStrategy, Strategy } from './strategies';

export class Container {
  readonly keyBindings: Map<string, KeyBinding> = new Map();

  ignoreTargets: IgnoreTarget[] = DEFAULT_IGNORE_TARGETS;

  name: string | undefined;
  registrationId: string | undefined;
  element: Element | undefined;

  strategy: Strategy = new ExclusiveStrategy();

  constructor(_name?: string, _element?: Element, _strategy?: Strategy) {
    this.name = _name;
    this.element = _element;
    if (_strategy) {
      this.strategy = _strategy;
    }
  }

  addKeyBinding(keyBinding: KeyBinding): void {
    console.log(
      `[CONTAINER] ${this.registrationId ?? 'global'}: Adding KeyBinding ${
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
    if (
      !this.ignoreTargets.some(
        (ignoreTarget) => event.target instanceof ignoreTarget
      )
    ) {
      const keyBinding = this.keyBindings.get(event.key);

      let handled = false;
      if (keyBinding) {
        keyBinding.action();
        handled = true;
      }

      this.strategy.handleKeyBoardEvent(event, handled);
    }
  }

  discoverParentContainers(): Container[] {
    const parents = this.strategy.discoverParentContainers(this.element);
    return parents ? [...parents, this] : [this];
  }
}
