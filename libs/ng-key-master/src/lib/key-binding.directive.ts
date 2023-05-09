import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { KeyBinding } from './models';
import {
  ADD_KEY_EVENT_NAME,
  KEY_BINDINGS_CONTAINER_SELECTOR,
  REMOVE_KEY_EVENT_NAME,
} from './key-bindings-container.directive';
import { VisualizationStrategyOptions } from './visualizer/visualization-strategies';

@Directive({
  selector: '[kmKeyBinding]',
  standalone: true,
})
export class KeyBindingDirective implements AfterViewInit, OnDestroy {
  @Input()
  keyBinding!: KeyBinding;

  #assignedContainer: Element | null = null;

  constructor(
    private readonly elementRef: ElementRef<Element>,
    private readonly visualizationStrategyOptions: VisualizationStrategyOptions
  ) {}

  ngAfterViewInit() {
    // TODO: should be checked in OnChanges-Lifecycle
    if (!this.keyBinding) {
      throw 'No KeyBinding provided';
    }

    this.#assignedContainer = this.elementRef.nativeElement.closest(
      KEY_BINDINGS_CONTAINER_SELECTOR
    );

    this.#assignedContainer?.dispatchEvent(
      new CustomEvent<KeyBinding>(ADD_KEY_EVENT_NAME, {
        detail: {
          ...this.keyBinding,
          element: this.elementRef.nativeElement,
          strategy:
            this.keyBinding.strategy ??
            this.visualizationStrategyOptions.overlay(),
        },
      })
    );
  }

  ngOnDestroy() {
    this.#assignedContainer?.dispatchEvent(
      new CustomEvent<KeyBinding>(REMOVE_KEY_EVENT_NAME, {
        detail: {
          ...this.keyBinding,
          element: this.elementRef.nativeElement,
          strategy:
            this.keyBinding.strategy ??
            this.visualizationStrategyOptions.overlay(),
        },
      })
    );
  }
}
