import {inject, Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {ACTIVE_ELEMENT, ActiveElement} from './active-element.token';
import {KeyBinding} from './models';
import {DOCUMENT} from '@angular/common';
import {Container} from './container';
import {KEY_BINDINGS_CONTAINER_SELECTOR} from './key-bindings-container.directive';
import {GlobalContainer} from "./global-container";

@Injectable({
  providedIn: 'root',
})
export class KeyMasterService {
  readonly globalContainer: Container = inject(GlobalContainer);

  readonly #containers: Map<string, Container> = new Map();

  constructor(
    @Inject(ACTIVE_ELEMENT)
    private readonly activeElement$: Observable<ActiveElement>,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
  }

  registerContainer(container: Container): string {
    const uuid = this.#containers.size.toString();
    this.#containers.set(uuid, container);
    return uuid;
  }

  deregisterContainer(uuid: string): void {
    this.#containers.delete(uuid);
  }

  getActiveContainers(): Observable<Container[]> {
    return this.activeElement$.pipe(
      map(
        (activeElement) =>
          this.getParentContainerFromElement(activeElement) ??
          this.globalContainer
      ),
      distinctUntilChanged(),
      map((container) => container.discoverParentContainers()),
      shareReplay(1)
    );
  }

  getParentContainerFromElement(
    element: Element | null | undefined
  ): Container | undefined {
    // parentElement used because "closest" return element itself if it matches selector
    const closestContainerElement = element?.parentElement?.closest(
      KEY_BINDINGS_CONTAINER_SELECTOR
    );

    if (closestContainerElement) {
      for (const container of this.#containers.values()) {
        if (container.element === closestContainerElement) {
          return container;
        }
      }
    }

    return undefined;
  }

  getActiveKeyBindings(): Observable<Map<string, KeyBinding[]>> {
    return this.getActiveContainers().pipe(
      map((containers) => {
        const groups = new Map<string, KeyBinding[]>();
        containers.map((container) => {
          groups.set(container.name ?? 'others', [
            ...container.keyBindings.values(),
          ]);
        });
        return groups;
      })
    );
  }
}
