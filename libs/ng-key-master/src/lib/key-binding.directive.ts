import {Directive, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output,} from '@angular/core';
import {DEFAULT_VISUALIZATION_STRATEGY} from "./tokens";
import {VisualizationStrategy} from "./visualizer/visualization-strategies";
import {KeyMasterService} from "./key-master.service";
import {Container} from "./container";
import {KeyBinding} from "./models";

@Directive({
  selector: '[kmKeyBinding]',
  standalone: true,
})
export class KeyBindingDirective implements OnInit, OnDestroy {

  @Input({required: true})
  key!: string;

  @Input()
  label: string | undefined;

  @Input()
  strategy: VisualizationStrategy = inject(DEFAULT_VISUALIZATION_STRATEGY)();

  @Input()
  multi = false;

  @Output()
  action = new EventEmitter<void>();

  #assignedContainer: Container | undefined;

  #keyBinding: KeyBinding | undefined;

  constructor(
    private readonly elementRef: ElementRef<Element>,
    private readonly keyMasterService: KeyMasterService,
  ) {
  }

  ngOnInit() {
    this.#assignedContainer = this.keyMasterService.getParentContainerFromElement(this.elementRef.nativeElement);

    if (!this.#assignedContainer) {
      throw 'KeyBindingDirective must be used inside a KeyBindingsContainerDirective';
    }

    this.#keyBinding = {
      key: this.key,
      action: () => this.action.emit(),
      label: this.label,
      element: this.elementRef.nativeElement,
      strategy: this.strategy,
      multi: this.multi,
    }

    this.#assignedContainer?.addKeyBinding(this.#keyBinding);
  }

  ngOnDestroy() {
    if (this.#assignedContainer && this.#keyBinding) {
      this.#assignedContainer.removeKeyBinding(this.#keyBinding);
    }
  }

}
