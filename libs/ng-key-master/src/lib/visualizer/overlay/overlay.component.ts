import {Component, inject, TrackByFunction} from '@angular/core';
import {transition, trigger, useAnimation} from '@angular/animations';
import {VisualizationService} from '../visualization.service';
import {KeyBinding} from '../../models';
import {fadeIn, zoomIn, zoomOut} from '../animations';
import {AsyncPipe, KeyValue, KeyValuePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {SymbolizeKeyPipe} from "../../keycode/symbolizeKey.pipe";
import {NumberIteratorPipe} from './number-iterator.pipe';

@Component({
  selector: 'km-overlay',
  templateUrl: 'overlay.component.html',
  styleUrls: ['overlay.component.scss'],
  standalone: true,
  imports: [NgForOf, KeyValuePipe, AsyncPipe, NgIf, SymbolizeKeyPipe, NumberIteratorPipe, NgClass],
  animations: [
    trigger('zoom', [
      transition(':enter', useAnimation(zoomIn)),
      transition(':leave', useAnimation(zoomOut)),
    ]),
    trigger('fade', [transition(':enter', useAnimation(fadeIn))]),
  ],
})
export class OverlayComponent {

  gridConfig = {
    maxRows: 3,
  }

  readonly overlayService = inject(VisualizationService);

  totalPages = 3;
  currentPage = 0;

  trackByKey: TrackByFunction<KeyValue<string, KeyBinding[]>> = (_, x) =>
    x.key;
  trackByElement: TrackByFunction<KeyBinding> = (_, keyBinding) =>
    keyBinding.element;

  // KeyValue pipe orders by map-key, by returning 1 the order is kept as is
  groupsSort = (
    _a: KeyValue<string, KeyBinding[]>,
    _b: KeyValue<string, KeyBinding[]>
  ): number => 1;

  isEmpty(groups: Map<string, KeyBinding[]>) {
    return Array.from(groups.values()).flat().length === 0
  }

  nextPage() {
    this.currentPage = Math.min(this.currentPage + 1, this.totalPages - 1);
  }

  previousPage() {
    this.currentPage = Math.max(this.currentPage - 1, 0);
  }
}
