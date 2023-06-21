import {Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListNavigationWrapperComponent} from "../list-navigation-wrapper.component";
import {getFirstFocusableIn} from "../../utils";

@Component({
  selector: 'key-master-wrapped-list',
  standalone: true,
  imports: [CommonModule, ListNavigationWrapperComponent],
  templateUrl: './wrapped-list.component.html',
})
export class WrappedListComponent {

  @ViewChildren('itemElements') listItems!: QueryList<ElementRef<HTMLLIElement>>

  items = ['Tobias', 'Bernd', 'Alfred', 'Günther'];

  selected = new Set<string>([this.items[0]]);

  focusedItemIndex = -1;

  focusPreviousItem() {
    this.focusItemByIndex(this.focusedItemIndex - 1);
  }

  focusNextItem() {
    this.focusItemByIndex(this.focusedItemIndex + 1);
  }

  toggleAll() {
    this.areAllSelected()
      ? this.selected.clear()
      : this.items.forEach(item => this.selected.add(item));
  }

  toggleSelected(item: string) {
    this.isSelected(item)
      ? this.selected.delete(item)
      : this.selected.add(item);
  }

  areAllSelected() {
    return this.selected.size === this.items.length;
  }

  isSelected(item: string) {
    return this.selected.has(item);
  }

  focusItemByIndex(index: number) {
    const item = this.listItems.get(index);
    if (item) {
      getFirstFocusableIn(item.nativeElement)?.focus();
    }
  }
}
