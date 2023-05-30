import {Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {
  KeyBindingDirective,
  KeyBindingsContainerDirective,
  MultiKeyBindingsDirective,
  StrategyOptions,
  VisualizationStrategyOptions
} from "@key-master/ng-key-master";


@Component({
  selector: 'key-master-list',
  standalone: true,
  imports: [CommonModule, FormsModule, KeyBindingsContainerDirective, KeyBindingDirective, MultiKeyBindingsDirective],
  templateUrl: './list.component.html',
})
export class ListComponent {

  @ViewChildren('itemElements') listItems!: QueryList<ElementRef<HTMLLIElement>>

  items = ['Tobias', 'Bernd', 'Alfred', 'Günther'];

  selected = new Set<string>([this.items[0]]);

  focusedItemIndex = -1;

  constructor(
    public readonly strategyOptions: StrategyOptions,
    public readonly visualizationStrategyOptions: VisualizationStrategyOptions
  ) {
  }

  setFocusedItemIndex(index: number) {
    this.focusedItemIndex = index;
  }

  focusPreviousItem = () => this.focusItemByIndex(this.focusedItemIndex - 1);
  focusNextItem = () => this.focusItemByIndex(this.focusedItemIndex + 1);

  duplicateSelected(item: string) {
    this.items.push(item);
  }

  getSelected(): string[] {
    return Array.from(this.selected);
  }

  selectAll() {
    this.selected.clear();
    this.items.forEach(item => this.selected.add(item));
  }

  deselectAll() {
    this.selected.clear();
  }

  select(item: string) {
    if (!this.selected.has(item)) {
      this.selected.add(item);
    }
  }

  deselect(item: string) {
    this.selected.delete(item);
  }

  isSelected(item: string) {
    return this.selected.has(item);
  }

  areAllSelected() {
    return this.selected.size === this.items.length;
  }

  toggleAll() {
    this.areAllSelected() ? this.deselectAll() : this.selectAll();
  }

  toggleSelected(item: string) {
    this.isSelected(item) ? this.deselect(item) : this.select(item);
  }

  focusItemByIndex(index: number) {
    const item = this.listItems.get(index);
    if (item) {
      const firstFocusable = Array.from(item.nativeElement.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'))
        .filter((el): el is HTMLElement => el instanceof HTMLElement
          && !el.hasAttribute('disabled')
          && !el.getAttribute('aria-hidden'))[0];

      firstFocusable?.focus();
    }
  }
}
