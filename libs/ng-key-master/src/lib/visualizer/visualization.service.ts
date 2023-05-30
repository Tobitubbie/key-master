import {Injectable} from '@angular/core';
import {OverlayComponent} from './overlay.component';
import {ComponentPortal} from '@angular/cdk/portal';
import {KeyMasterService} from '../key-master.service';
import {GlobalPositionStrategy, Overlay} from '@angular/cdk/overlay';
import {map, pairwise, shareReplay, startWith, tap} from 'rxjs/operators';
import {VisualizationStrategy} from './visualization-strategies';
import {BehaviorSubject, Observable} from 'rxjs';
import {KeyBinding} from '../models';
import {Container} from "../container";


function groupKeyBindingsByContainer(containers: Container[]): Map<string, KeyBinding[]> {
  const groups = new Map<string, KeyBinding[]>();
  containers.forEach((container) => groups.set(container.name ?? 'others', distinctByKey(container.keyBindings)));
  return groups;
}

function distinctByKey(keyBindings: KeyBinding[]): KeyBinding[] {
  return keyBindings.filter(keyBinding => {
    return keyBindings.findIndex(kb => kb.key === keyBinding.key) === keyBindings.indexOf(keyBinding);
  })
}

@Injectable({providedIn: 'root'})
export class VisualizationService {
  strategyRefs = new Set<VisualizationStrategy>();

  activeKeyBindings$: Observable<Map<string, KeyBinding[]>> = this.keyMasterService.getActiveContainers().pipe(
    startWith<Container[]>([]),
    pairwise(),
    shareReplay(1),
    tap(([prev, cur]) => {
      const previousKeyBindings = prev.flatMap(container => container.keyBindings);
      const currentKeyBindings = cur.flatMap(container => container.keyBindings);
      this.#updateStrategyRefs(previousKeyBindings, currentKeyBindings)
    }),
    map(([, containers]) => groupKeyBindingsByContainer(containers)),
  );

  #isOpen = new BehaviorSubject(false);
  get isOpen() {
    return this.#isOpen.value;
  }

  isOpen$ = this.#isOpen.asObservable();

  #globalPortal = new ComponentPortal(OverlayComponent);
  #globalOverlayHost = this.overlay.create({
    positionStrategy: new GlobalPositionStrategy()
      .centerHorizontally()
      .bottom('5vh'),
  });

  constructor(
    private keyMasterService: KeyMasterService,
    private overlay: Overlay
  ) {
    // place global overlay over keybinding overlays (keybinding overlays added later -> by default they overlap global overlay)
    // Attention: might cause bugs with mat-dialogs/-dropdowns or similar components -> TODO: needs to be tested
    this.#globalOverlayHost.hostElement.classList.add('z-[1001]');
  }

  showOverlay(): void {
    if (!this.isOpen) {
      if (!this.#globalPortal.isAttached) {
        this.#globalPortal.attach(this.#globalOverlayHost);
      }
      this.strategyRefs.forEach((strategy) => strategy.show());
    }
    this.#isOpen.next(true);
  }

  hideOverlay(): void {
    if (this.isOpen) {
      this.strategyRefs.forEach((strategy) => strategy.hide());
    }
    this.#isOpen.next(false);
  }

  toggleOverlay(): void {
    this.isOpen ? this.hideOverlay() : this.showOverlay();
  }

  #updateStrategyRefs(previousKeyBindings: KeyBinding[], currentKeyBindings: KeyBinding[]): void {

    // adds missing keyBindings
    currentKeyBindings
      .filter((kb) => !previousKeyBindings.includes(kb))
      .forEach((kb) => {
        const strategy = kb.strategy;
        if (strategy) {
          strategy.create(kb);
          this.strategyRefs.add(strategy);
        }
      });

    // removes obsolete keyBindings
    previousKeyBindings
      .filter((kb) => !currentKeyBindings.includes(kb))
      .forEach((kb) => {
        const strategy = kb.strategy;
        if (strategy) {
          strategy.destroy();
          this.strategyRefs.delete(strategy);
        }
      });
  }
}
