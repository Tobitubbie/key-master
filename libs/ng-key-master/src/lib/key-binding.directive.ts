import {AfterViewInit, Directive, ElementRef, inject, Input, OnDestroy,} from '@angular/core';
import {Shortcut} from './models';
import {DEFAULT_VISUALIZATION_STRATEGY} from "./tokens";
import {VisualizationStrategy} from "./visualizer/visualization-strategies";
import {KeyMasterService} from "./key-master.service";
import {Container} from "./container";

@Directive({
  selector: '[kmKeyBinding]',
  standalone: true,
})
export class KeyBindingDirective implements AfterViewInit, OnDestroy {

  @Input({required: true, alias: 'kmKeyBinding'})
  shortcut!: Shortcut;

  @Input()
  strategy: VisualizationStrategy = inject(DEFAULT_VISUALIZATION_STRATEGY)();

  #assignedContainer: Container | undefined;

  constructor(
    private readonly elementRef: ElementRef<Element>,
    private readonly keyMasterService: KeyMasterService,
  ) {
  }

  ngAfterViewInit() {
    this.#assignedContainer = this.keyMasterService.getParentContainerFromElement(this.elementRef.nativeElement);

    if (!this.#assignedContainer) {
      throw 'KeyBindingDirective must be used inside a KeyBindingsContainerDirective';
    }

    this.#assignedContainer?.addKeyBinding({
      ...this.shortcut,
      element: this.elementRef.nativeElement,
      strategy: this.strategy,
    });
  }

  ngOnDestroy() {
    this.#assignedContainer?.removeKeyBinding({
      ...this.shortcut,
      element: this.elementRef.nativeElement,
      strategy: this.strategy,
    });
  }
}
