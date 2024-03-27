import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {Container} from './container';
import {KEY_BINDINGS_CONTAINER_SELECTOR} from './key-bindings-container.directive';
import {GlobalContainer} from "./global-container";
import {ACTIVE_ELEMENT} from "./tokens";
import {ActiveElement} from "./models";

@Injectable({
  providedIn: 'root',
})
export class KeyMasterService {

  #activeElement: Signal<ActiveElement> = inject(ACTIVE_ELEMENT);

  #containers = signal<Set<Container>>(new Set());
  readonly containers = this.#containers.asReadonly();

  #closestContainer = computed(() => this.getParentContainerFromElement(this.#activeElement()) ?? this.globalContainer,
    {equal: (prev, cur) => prev === cur});

  activeContainers = computed(() => {
    const activeContainers = this.#closestContainer().discoverParentContainers();
    activeContainers.forEach(c => c.keyBindings()); // workaround to detect changes of keybindings TODO: check if still necessary
    return activeContainers;
  });

  readonly globalContainer: Container = inject(GlobalContainer);

  registerContainer(container: Container): void {
    this.#containers.update((containers) => containers.add(container));
  }

  deregisterContainer(container: Container): void {
    this.#containers.update((containers) => {
      containers.delete(container);
      return containers;
    });
  }

  getParentContainerFromElement(element: Element | null | undefined): Container | undefined {
    // parentElement used because "closest" return element itself if it matches selector
    const closestContainerElement = element?.parentElement?.closest(
      KEY_BINDINGS_CONTAINER_SELECTOR
    );

    if (closestContainerElement) {
      for (const container of this.#containers()) {
        if (container.element === closestContainerElement) {
          return container;
        }
      }
    }

    return undefined;
  }
}
