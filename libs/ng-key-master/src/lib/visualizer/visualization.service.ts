import {Injectable} from '@angular/core';
import {OverlayComponent} from './overlay.component';
import {ComponentPortal} from '@angular/cdk/portal';
import {KeyMasterService} from '../key-master.service';
import {GlobalPositionStrategy, Overlay} from '@angular/cdk/overlay';
import {map, pairwise, shareReplay, startWith, tap} from 'rxjs/operators';
import {VisualizationStrategy} from './visualization-strategies';
import {BehaviorSubject, Observable} from 'rxjs';
import {KeyBinding} from '../models';

@Injectable({providedIn: 'root'})
export class VisualizationService {
  strategyRefs: Set<VisualizationStrategy> = new Set();

  activeKeyBindings$: Observable<Map<string, KeyBinding[]>> = this.keyMasterService.getActiveContainers().pipe(
    map((containers) => {
      const groups = new Map<string, KeyBinding[]>();
      containers.map((container) => {
        groups.set(container.name ?? 'others', [
          ...container.keyBindings.values(),
        ]);
      });
      return groups;
    }),
    startWith(new Map<string, KeyBinding[]>()),
    pairwise(),
    shareReplay(1),
    tap(([prev, cur]) => this.#updateStrategyRefs(prev, cur)),
    map(([, activeKeyBindingMap]) => activeKeyBindingMap)
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
    // Attention: might cause bugs with mat-dialogs/-dropdowns or similar components -> needs to be tested
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

  #updateStrategyRefs(previousMap: Map<string, KeyBinding[]>, currentMap: Map<string, KeyBinding[]>): void {
    const previousKeyBindings = Array.from<KeyBinding[]>(previousMap.values()).flat();
    const currentKeyBindings = Array.from<KeyBinding[]>(currentMap.values()).flat();

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
