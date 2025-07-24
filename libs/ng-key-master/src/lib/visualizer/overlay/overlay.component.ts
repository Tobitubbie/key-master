import {transition, trigger, useAnimation} from '@angular/animations';
import {AsyncPipe, JsonPipe, KeyValuePipe, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  model,
  Renderer2,
  signal,
  untracked,
  viewChildren
} from '@angular/core';
import {SymbolizeKeyPipe} from "../../keycode/symbolizeKey.pipe";
import {KeyBinding} from '../../models';
import {fadeIn, zoomIn, zoomOut} from '../animations';
import {VisualizationService} from '../visualization.service';
import {NumberIteratorPipe} from './number-iterator.pipe';


type Page = {
  keyBindings: KeyBinding[];
  containerName: string;
}

@Component({
  selector: 'km-overlay',
  templateUrl: 'overlay.component.html',
  styleUrls: ['overlay.component.scss'],
  standalone: true,
  imports: [NgIf, SymbolizeKeyPipe, NumberIteratorPipe, NgStyle],
  animations: [
    trigger('zoom', [
      transition(':enter', useAnimation(zoomIn)),
      transition(':leave', useAnimation(zoomOut)),
    ]),
    trigger('fade', [transition(':enter', useAnimation(fadeIn))]),
  ],
})
export class OverlayComponent {


  readonly renderer2 = inject(Renderer2)
  readonly overlayService = inject(VisualizationService);

  pageIndicators = viewChildren<ElementRef>('pageIndicator');

  gridConfig = model({
    rows: 3,
    cols: 3,
  });

  gridStyles = computed(() => ({
    'grid-template-rows': `repeat(${this.gridConfig().rows}, minmax(0, 1fr))`,
  }));

  currentPageIndex = signal(0);
  currentPage = computed<Page | undefined>(() => this.pages()[this.currentPageIndex()]);

  pagesPerContainer = computed(() =>
    this.pages().reduce((acc, page) => {
      acc[page.containerName] = acc[page.containerName] || 0;
      acc[page.containerName]++;
      return acc;
    }, <Record<string, number>>{})
  );

  itemsPerPage = computed(() => this.gridConfig().cols * this.gridConfig().rows);
  totalPages = computed(() => this.pages().length);
  pages = computed<Page[]>(() => {
    const activeKeyBindings = this.overlayService.activeKeyBindings();
    const itemsPerPage = this.itemsPerPage();
    const pages = <Page[]>[];

    for (const [containerName, keyBindings] of activeKeyBindings.entries()) {
      const totalContainerPages = Math.ceil(keyBindings.length / itemsPerPage);
      for (let i = 0; i < totalContainerPages; i++) {
        const start = i * itemsPerPage;
        const end = start + itemsPerPage;
        // TODO: use native toSlice
        const pagedKeyBindings = [...keyBindings].slice(start, end);

        pages.push({keyBindings: pagedKeyBindings, containerName});
      }
    }

    return pages;
  });

  constructor() {
    // restore currentPageIndex on pages change
    effect(() => {
      const pages = this.pages();
      const currentPageIndex = untracked(this.currentPageIndex);
      const currentPage = untracked(this.currentPage);

      // reset on out-of-bounds
      if (currentPageIndex > pages.length - 1) {
        this.currentPageIndex.set(Math.max(0, pages.length - 1));
      }

      // select closest container (^= container of last page), if not already selected
      const closestContainerName: string | undefined = pages[pages.length -1]?.containerName;
      if (closestContainerName && currentPage?.containerName !== closestContainerName) {
        const closestContainerIndex = pages.findIndex(page => page.containerName === closestContainerName);
        this.currentPageIndex.set(closestContainerIndex);
      }


    }, {allowSignalWrites: true});

    // highlight current page indicator
    effect(() => {
      const currentIndex = this.currentPageIndex();
      const highlightClass = '!bg-neutral-300';
      this.pageIndicators().forEach((indicator, index) => {
        currentIndex === index
          ? this.renderer2.addClass(indicator.nativeElement, highlightClass)
          : this.renderer2.removeClass(indicator.nativeElement, highlightClass);
      });
    });

    // scroll current page into view
    effect(() => {
      const currentIndex = this.currentPageIndex();
      this.pageIndicators()[currentIndex]?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    });
  }

  isEmpty(groups: Map<string, KeyBinding[]>) {
    return Array.from(groups.values()).flat().length === 0
  }

  nextPage() {
    this.currentPageIndex.update(currentPage => Math.min(currentPage + 1, this.totalPages() - 1));
  }

  previousPage() {
    this.currentPageIndex.update(currentPage => Math.max(0, currentPage - 1));
  }

  selectPage_byContainerName(containerName: string) {
    if (this.currentPage()?.containerName === containerName) return; // noop if container already selected

    const firstPageIndex = this.pages().findIndex(p => p.containerName === containerName);
    if (firstPageIndex > -1) {
      this.currentPageIndex.set(firstPageIndex);
    }
  }
}
