import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {OverlayComponent} from './overlay/overlay.component';
import {ComponentPortal} from '@angular/cdk/portal';
import {KeyMasterService} from '../key-master.service';
import {GlobalPositionStrategy, Overlay} from '@angular/cdk/overlay';
import {KeyBinding} from '../models';
import {VisualizationStrategy} from "./strategies/visualization-strategy";
import {groupKeyBindingsByContainer} from '../utils';


// TODO: make configurable (or enforce container-name)
export const containerNameFallback = 'Others';

@Injectable({providedIn: 'root'})
export class VisualizationService {

  #strategies = new Set<VisualizationStrategy>();

  activeKeyBindings = computed(() => groupKeyBindingsByContainer(this.keyMasterService.activeContainers()));

  #isOpen = signal(false);
  isOpen = this.#isOpen.asReadonly();

  #globalPortal = new ComponentPortal(OverlayComponent);
  #globalOverlayHost = inject(Overlay).create({
    positionStrategy: new GlobalPositionStrategy()
      .centerHorizontally()
      .bottom('5vh'),
  });

  constructor(
    private keyMasterService: KeyMasterService,
  ) {
    // place global overlay over keybinding overlays (keybinding overlays added later -> by default they overlap global overlay)
    // Attention: might cause bugs with mat-dialogs/-dropdowns or any element with higher z-index -> TODO: needs to be tested
    this.#globalOverlayHost.hostElement.classList.add('z-[1001]');

    // on active-containers change: refresh visualizations
    effect(() => {
      const activeKeyBindings = this.keyMasterService
        .activeContainers()
        .flatMap(c => c.keyBindings());
      this.refreshVisualizations(activeKeyBindings);
    });
  }

  showOverlay(): void {
    if (!this.#isOpen()) {
      if (!this.#globalPortal.isAttached) {
        this.#globalPortal.attach(this.#globalOverlayHost);
      }
      this.#strategies.forEach((strategy) => strategy.show());
    }
    this.#isOpen.set(true);
  }

  hideOverlay(): void {
    if (this.#isOpen()) {
      this.#strategies.forEach((strategy) => strategy.hide());
    }
    this.#isOpen.set(false);
  }

  toggleOverlay(): void {
    this.#isOpen() ? this.hideOverlay() : this.showOverlay();
  }

  refreshVisualizations(activeKeyBindings: KeyBinding[]): void {
    this.#strategies.forEach(s => {
      if (!activeKeyBindings.some(kb => kb.strategy === s)) {
        s.destroy()
      }
    });
    this.#strategies.clear();

    activeKeyBindings
      .forEach(kb => {
        const strategy = kb.strategy;
        if (strategy) {
          this.#strategies.add(strategy);
          strategy.create(kb);
          this.#isOpen() ? strategy.show() : strategy.hide();
        }
      });
  }
}
