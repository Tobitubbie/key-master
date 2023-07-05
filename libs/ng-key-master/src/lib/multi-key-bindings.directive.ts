import {Directive, ElementRef, inject, Input, OnDestroy, OnInit,} from '@angular/core';
import {DEFAULT_VISUALIZATION_STRATEGY} from "./tokens";
import {KeyMasterService} from "./key-master.service";
import {Container} from "./container";
import {KeyBinding} from "./models";
import {VisualizationStrategy} from "./visualizer/strategies/visualization-strategy";


@Directive({
  selector: '[kmMultiKeyBindings]',
  standalone: true,
})
export class MultiKeyBindingsDirective implements OnInit, OnDestroy {

  @Input({required: true, alias: 'kmMultiKeyBindings'})
  shortcuts: Array<{
    key: string,
    action: VoidFunction,
    label?: string,
    strategy?: VisualizationStrategy,
    multi?: boolean
  }> = [];

  #defaultStrategy = inject(DEFAULT_VISUALIZATION_STRATEGY);

  #assignedContainer: Container | undefined;

  #keyBindings: KeyBinding[] = [];

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

    this.shortcuts.forEach(({key, action, label, strategy, multi}) => {
      this.#keyBindings.push({
        key,
        action,
        label,
        multi,
        strategy: strategy ?? this.#defaultStrategy(),
        element: this.elementRef.nativeElement,
      });
    });

    this.#keyBindings.forEach(keyBinding => {
      this.#assignedContainer?.addKeyBinding(keyBinding);
    });
  }

  ngOnDestroy() {
    this.#keyBindings.forEach(keyBinding => {
      this.#assignedContainer?.addKeyBinding(keyBinding);
    });
  }
}
