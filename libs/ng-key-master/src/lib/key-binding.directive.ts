import {AfterViewInit, Directive, ElementRef, EventEmitter, inject, Input, OnDestroy, Output,} from '@angular/core';
import {DEFAULT_VISUALIZATION_STRATEGY} from "./tokens";
import {VisualizationStrategy} from "./visualizer/visualization-strategies";
import {KeyMasterService} from "./key-master.service";
import {Container} from "./container";

@Directive({
  selector: '[kmKeyBinding]',
  standalone: true,
})
export class KeyBindingDirective implements AfterViewInit, OnDestroy {

  @Input({required: true})
  key!: string;

  @Input()
  label: string | undefined;

  @Input()
  strategy: VisualizationStrategy = inject(DEFAULT_VISUALIZATION_STRATEGY)();

  @Output()
  action = new EventEmitter<void>();

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
      key: this.key,
      action: () => this.action.emit(),
      label: this.label,
      element: this.elementRef.nativeElement,
      strategy: this.strategy,
    });
  }

  ngOnDestroy() {
    this.#assignedContainer?.removeKeyBinding({
      key: this.key,
      action: () => this.action.emit(),
      label: this.label,
      element: this.elementRef.nativeElement,
      strategy: this.strategy,
    });
  }
}
