import {Component, ElementRef, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  KeyBinding,
  KeyBindingsContainerDirective,
  MultiKeyBindingsDirective,
  StrategyOptions,
  VisualizationStrategyOptions
} from "@key-master/ng-key-master";
import {Subject} from "rxjs";


@Component({
  selector: 'key-master-list-navigation-wrapper',
  standalone: true,
  imports: [CommonModule, KeyBindingsContainerDirective, MultiKeyBindingsDirective],
  templateUrl: './list-navigation-wrapper.component.html',
})
export class ListNavigationWrapperComponent implements OnInit {

  @Output() focusPrevious = new EventEmitter<void>();
  @Output() focusNext = new EventEmitter<void>();

  @Output() toggleAll = new EventEmitter<void>();
  @Output() selectAll = new EventEmitter<void>();
  @Output() deselectAll = new EventEmitter<void>();

  @Output() toggleCurrent = new EventEmitter<void>();
  @Output() selectCurrent = new EventEmitter<void>();
  @Output() deselectCurrent = new EventEmitter<void>();

  visualizationOptions = inject(VisualizationStrategyOptions);
  strategyOptions = inject(StrategyOptions);
  elementRef = inject(ElementRef);

  boundKeyBindings: KeyBinding[] = [];

  keyBindings = new Map<string, KeyBinding>([
    ['focusPrevious', {
      key: 'up',
      action: () => this.focusPrevious.emit(),
      label: 'Select Previous Item'
    }],
    ['focusNext', {
      key: 'down',
      action: () => this.focusNext.emit(),
      label: 'Select Next Item'
    }],

    ['toggleAll', {
      key: 'a',
      action: () => this.toggleAll.emit(),
      label: 'Toggle All'
    }],
    ['selectAll', {
      key: 'q',
      action: () => this.selectAll.emit(),
      label: 'Select All'
    }],
    ['deselectAll', {
      key: 'w',
      action: () => this.deselectAll.emit(),
      label: 'Deselect All'
    }],

    ['toggleCurrent', {
      key: 'x',
      action: () => this.toggleCurrent.emit(),
      label: 'Toggle Current Selection'
    }],
    ['selectCurrent', {
      key: 's',
      action: () => this.selectCurrent.emit(),
      label: 'Toggle Current Selection'
    }],
    ['deselectCurrent', {
      key: 'd',
      action: () => this.deselectCurrent.emit(),
      label: 'Toggle Current Selection',
    }],
  ]);

  ngOnInit() {
    const isObserved = (obj: unknown): obj is Subject<unknown> => obj instanceof Subject<unknown> && obj.observed;

    Object.entries(this)
      .filter(([, value]) => isObserved(value))
      .forEach(([key]) => {
        const keyBinding = this.keyBindings.get(key)
        if (keyBinding) {
          this.boundKeyBindings.push({
            ...keyBinding,
            strategy: this.visualizationOptions.noop(),
            element: this.elementRef.nativeElement,
          })
        }
      });
  }

}
