import {computed, effect, Injectable, signal} from '@angular/core';
import {OverlayComponent} from './overlay.component';
import {ComponentPortal} from '@angular/cdk/portal';
import {KeyMasterService} from '../key-master.service';
import {GlobalPositionStrategy, Overlay} from '@angular/cdk/overlay';
import {VisualizationStrategy} from './visualization-strategies';
import {KeyBinding} from '../models';
import {Container} from "../container";


function groupKeyBindingsByContainer(containers: Container[]): Map<string, KeyBinding[]> {
  const groups = new Map<string, KeyBinding[]>();
  containers.forEach((container) => groups.set(container.name ?? 'others', distinctByKey(container.keyBindings())));
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

  activeKeyBindings = computed(() => groupKeyBindingsByContainer(this.keyMasterService.activeContainers()));

  #isOpen = signal<boolean>(false);
  isOpen = this.#isOpen.asReadonly();

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
    // Attention: might cause bugs with mat-dialogs/-dropdowns or any element with higher z-index -> TODO: needs to be tested
    this.#globalOverlayHost.hostElement.classList.add('z-[1001]');

    // on active-containers change: handles creation/destruction of all visualizations
    effect(() => {
      this.strategyRefs.forEach(s => s.destroy());
      this.strategyRefs.clear();

      this.keyMasterService.activeContainers()
        .flatMap(c => c.keyBindings())
        .forEach(kb => {
          const strategy = kb.strategy;
          if (strategy) {
            this.strategyRefs.add(strategy);
            strategy.create(kb);
            this.#isOpen() ? strategy.show() : strategy.hide();
          }
        });
    });
  }

  showOverlay(): void {
    if (!this.#isOpen()) {
      if (!this.#globalPortal.isAttached) {
        this.#globalPortal.attach(this.#globalOverlayHost);
      }
      this.strategyRefs.forEach((strategy) => strategy.show());
    }
    this.#isOpen.set(true);
  }

  hideOverlay(): void {
    if (this.#isOpen()) {
      this.strategyRefs.forEach((strategy) => strategy.hide());
    }
    this.#isOpen.set(false);
  }

  toggleOverlay(): void {
    this.#isOpen() ? this.hideOverlay() : this.showOverlay();
  }
}
