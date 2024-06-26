import {IgnoreTarget, KeyBinding} from './models';
import {keycodeMatchesEvent} from "./keycode/keycode";
import {signal} from "@angular/core";
import {NoopStrategy} from "./strategies/noop-strategy";
import {Strategy} from "./strategies/strategy";

export abstract class Container {

  #keyBindings = signal<KeyBinding[]>([]);
  readonly keyBindings = this.#keyBindings.asReadonly();

  ignoreTargets: IgnoreTarget[] = [];
  strategy: Strategy = new NoopStrategy();
  name = 'Others';

  element: Element | undefined;

  addKeyBinding(keyBinding: KeyBinding): void {
    console.log(`[CONTAINER] ${this.name}: Adding KeyBinding ${keyBinding.label}`);
    if (keyBinding.multi || !this.#keyBindings().some(kb => kb.key === keyBinding.key)) {
      this.#keyBindings.update(keyBindings => [...keyBindings, keyBinding]);
    } else {
      throw `[CONTAINER] ${this.name}: Binding for Key ${keyBinding.key} already exists`;
    }
  }

  removeKeyBinding(keyBinding: KeyBinding): void {
    console.log(`[CONTAINER] ${this.name}: Removing KeyBinding ${keyBinding.label}`);
    this.#keyBindings.update(keyBindings => keyBindings.filter(kb => kb !== keyBinding));
  }

  onKeyboardEvent(event: KeyboardEvent): void {
    let handled = false;

    if (!this.ignoreTargets.some((ignoreTarget) =>
      event.target instanceof ignoreTarget)
    ) {

      for (const keyBinding of this.#keyBindings()) {
        if (keycodeMatchesEvent(keyBinding.key, event)
          && (!keyBinding.multi || keyBinding.element?.contains(document.activeElement))) {
            keyBinding.action();
            handled = true;
            break;
        }
      }
    }

    this.strategy.handleKeyBoardEvent(event, handled);
  }

  discoverParentContainers(): Container[] {
    const parents = this.strategy.discoverParentContainers(this.element);
    return parents ? [...parents, this] : [this];
  }
}
