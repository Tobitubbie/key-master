import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {KeyMasterService} from '../key-master.service';
import {Container} from '../container';
import {VisualizationService} from '../visualizer/visualization.service';
import {distinctByKey} from '../utils';


function containerAnnouncement(container: Container) {
  // note: punctuation is important for screen readers
  return `Key binding container: ${container.name}. ${distinctByKey(container.keyBindings()).map(kb => `${kb.label}: ${kb.key}`).join(', ')}.`;
}


@Injectable({providedIn: 'root'})
export class AnnouncerService {

  #liveAnnouncer = inject(LiveAnnouncer);
  #keyMasterService = inject(KeyMasterService);
  #visualizationService = inject(VisualizationService);

  #previousContainers: Container[] = [];

  #isActive = signal(false);
  isActive = this.#isActive.asReadonly();

  constructor() {
    effect(() => this.announceOnContainerChange());
    effect(() => this.announceOnOverlayToggle());
  }

  enable() {
    this.#isActive.set(true);
  }

  disable() {
    this.#isActive.set(false);
  }

  async announce(message: string, politeness: 'polite' | 'assertive' = 'polite'): Promise<void> {
    if (this.isActive()) {
      await this.#liveAnnouncer.announce(message, politeness);
    }
  }

  private async announceOnOverlayToggle() {
    const isOpen = this.#visualizationService.isOpen();
    const activeContainers = untracked(this.#keyMasterService.activeContainers);

    let announcement = `Overlay ${isOpen ? 'opened' : 'closed'}.`;

    if (isOpen) {
      announcement += ` ${activeContainers.map(containerAnnouncement).join(' ')}`;
    }

    await this.announce(announcement);
  }

  private async announceOnContainerChange() {
    const activeContainers = this.#keyMasterService.activeContainers();
    const newContainers = activeContainers.filter(container => !this.#previousContainers.includes(container));
    this.#previousContainers = activeContainers;

    if (newContainers.length > 0) {
      const announcement = newContainers.map(containerAnnouncement).join();
      await this.announce(announcement);
    }
  }
}
