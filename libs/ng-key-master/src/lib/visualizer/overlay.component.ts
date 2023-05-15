import {Component, TrackByFunction} from '@angular/core';
import {transition, trigger, useAnimation} from '@angular/animations';
import {VisualizationService} from './visualization.service';
import {KeyBinding} from '../models';
import {fadeIn, zoomIn, zoomOut} from './animations';
import {AsyncPipe, KeyValue, KeyValuePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'km-overlay',
  templateUrl: 'overlay.component.html',
  styleUrls: ['overlay.component.scss'],
  standalone: true,
  imports: [NgForOf, KeyValuePipe, AsyncPipe, NgIf],
  animations: [
    trigger('zoom', [
      transition(':enter', useAnimation(zoomIn)),
      transition(':leave', useAnimation(zoomOut)),
    ]),
    trigger('fade', [transition(':enter', useAnimation(fadeIn))]),
  ],
})
export class OverlayComponent {
  trackByGroup: TrackByFunction<KeyValue<string, KeyBinding[]>> = (_, x) =>
    x.key;
  trackByElement: TrackByFunction<KeyBinding> = (_, keyBinding) =>
    keyBinding.element;

  // KeyValue pipe orders by key, by returning 1 the order is kept as is
  groupsSort = (
    _a: KeyValue<string, KeyBinding[]>,
    _b: KeyValue<string, KeyBinding[]>
  ): number => 1;

  constructor(public readonly overlayService: VisualizationService) {
  }

  isEmpty(groups: Map<string, KeyBinding[]>) {
    return Array.from(groups.values()).flat().length === 0
  }
}
