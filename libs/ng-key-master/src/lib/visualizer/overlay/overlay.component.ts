import { Component, computed, effect, inject, model, OnInit, signal, TrackByFunction } from '@angular/core';
import {transition, trigger, useAnimation} from '@angular/animations';
import {VisualizationService} from '../visualization.service';
import {KeyBinding} from '../../models';
import {fadeIn, zoomIn, zoomOut} from '../animations';
import { AsyncPipe, JsonPipe, KeyValue, KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import {SymbolizeKeyPipe} from "../../keycode/symbolizeKey.pipe";
import {NumberIteratorPipe} from './number-iterator.pipe';

/*
* ---
* data:
*
* container
*   - page1 [ keybindings... ]  -> #1
* container-2
*   - page2 [ ...]              -> #2
*   - page3 [ ... ]             -> #3
*
* -> oder
* page1 -> container
* page2 -> container-2
* page3 -> container-2
*
* ---
* ui:
*
* totalPages = get page-count of containers
*
* ---
* pagedKeyBindings
* example:
*   currentPage = 2
*   gridConfig.maxRows = 3
*   gridConfig.maxCols = 3
*   => itemsPerPage = rows * cols
*   => totalPages = foreach container { keybindings.length / itemsPerPage }
*   => pages = [ { keybindings, container } ]
*
*   // c1: [ 4x keybinding ]
*   // c2: [ 2x keybinding ]
*
*   //
*
* */

type Page = {
  keyBindings: KeyBinding[];
  containerName: string;
}

@Component({
  selector: 'km-overlay',
  templateUrl: 'overlay.component.html',
  styleUrls: ['overlay.component.scss'],
  standalone: true,
  imports: [NgForOf, KeyValuePipe, AsyncPipe, NgIf, SymbolizeKeyPipe, NumberIteratorPipe, NgClass, JsonPipe],
  animations: [
    trigger('zoom', [
      transition(':enter', useAnimation(zoomIn)),
      transition(':leave', useAnimation(zoomOut)),
    ]),
    trigger('fade', [
      transition(':enter', useAnimation(fadeIn)),
    ]),
  ],
})
export class OverlayComponent {

  readonly overlayService = inject(VisualizationService);

  gridConfig = model({
    maxRows: 2, // TODO: apply grid-class "grid-rows-{{value}}" -> tailwind does not recognize dynamic value
    maxCols: 1, // TODO: apply grid-class "grid-cols-{{value}}" -> tailwind does not recognize dynamic value
  });

  currentPageIndex = signal(0);
  currentPage = computed(() => this.pages()[this.currentPageIndex()]);
  itemsPerPage = computed(() => this.gridConfig().maxCols * this.gridConfig().maxRows);

  totalPages = computed(() => this.pages().length);
  containers = computed(() => this.pages())
  pages = computed<Page[]>(() => {
    const keyBindings = this.overlayService.activeKeyBindings();
    const pages = <Page[]>[];

    keyBindings.forEach((keyBindings, containerName) => {
      const totalContainerPages = Math.ceil(keyBindings.length / this.itemsPerPage());
      for (let i = 0; i < totalContainerPages; i++) {
        const start = i * this.itemsPerPage();
        const end = start + this.itemsPerPage();
        // TODO: use native toSlice
        const pagedKeyBindings = [...keyBindings].slice(start, end);

        pages.push({ keyBindings: pagedKeyBindings, containerName });
      }
    });

    return pages;
  });

  // TODO: Bug: page-index gets "lost" when selected container goes inactive
  resetOnPageChange = effect(() => {
    const _pages = this.pages();
    this.currentPageIndex.set(0);
  });

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
    this.currentPageIndex.update(currentPage => Math.min(currentPage + 1, this.totalPages() - 1));
  }

  previousPage() {
    this.currentPageIndex.update(currentPage => Math.max(currentPage - 1, 0));
  }
}
