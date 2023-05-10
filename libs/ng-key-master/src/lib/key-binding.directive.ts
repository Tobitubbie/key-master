import {AfterViewInit, Directive, ElementRef, inject, Input, OnDestroy,} from '@angular/core';
import {KeyBinding} from './models';
import {
  ADD_KEY_EVENT_NAME,
  KEY_BINDINGS_CONTAINER_SELECTOR,
  REMOVE_KEY_EVENT_NAME,
} from './key-bindings-container.directive';
import {DEFAULT_VISUALIZATION_STRATEGY} from "./tokens";

@Directive({
  selector: '[kmKeyBinding]',
  standalone: true,
})
export class KeyBindingDirective implements AfterViewInit, OnDestroy {
  @Input()
  keyBinding!: KeyBinding;

  #assignedContainer: Element | null = null;

  #defaultStrategy = inject(DEFAULT_VISUALIZATION_STRATEGY)();

  constructor(
    private readonly elementRef: ElementRef<Element>,
  ) {
  }

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
            this.#defaultStrategy,
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
            this.#defaultStrategy,
        },
      })
    );
  }
}
