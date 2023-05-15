import {AfterViewInit, Directive, ElementRef, inject, Input, OnDestroy,} from '@angular/core';
import {KeyBinding, Shortcut} from './models';
import {
  ADD_KEY_EVENT_NAME,
  KEY_BINDINGS_CONTAINER_SELECTOR,
  REMOVE_KEY_EVENT_NAME,
} from './key-bindings-container.directive';
import {DEFAULT_VISUALIZATION_STRATEGY} from "./tokens";
import {VisualizationStrategy} from "./visualizer/visualization-strategies";

@Directive({
  selector: '[kmKeyBinding]',
  standalone: true,
})
export class KeyBindingDirective implements AfterViewInit, OnDestroy {

  @Input({required: true, alias: 'kmKeyBinding'})
  shortcut!: Shortcut;

  @Input()
  strategy: VisualizationStrategy = inject(DEFAULT_VISUALIZATION_STRATEGY)();

  #assignedContainer: Element | null = null;

  constructor(
    private readonly elementRef: ElementRef<Element>,
  ) {
  }

  ngAfterViewInit() {
    this.#assignedContainer = this.elementRef.nativeElement.closest(
      KEY_BINDINGS_CONTAINER_SELECTOR
    );

    if (!this.#assignedContainer) {
      throw 'KeyBindingDirective must be used inside a KeyBindingsContainerDirective';
    }

    this.#assignedContainer?.dispatchEvent(
      new CustomEvent<KeyBinding>(ADD_KEY_EVENT_NAME, {
        detail: {
          ...this.shortcut,
          element: this.elementRef.nativeElement,
          strategy: this.strategy,
        },
      })
    );
  }

  ngOnDestroy() {
    this.#assignedContainer?.dispatchEvent(
      new CustomEvent<KeyBinding>(REMOVE_KEY_EVENT_NAME, {
        detail: {
          ...this.shortcut,
          element: this.elementRef.nativeElement,
          strategy: this.strategy,
        },
      })
    );
  }
}
