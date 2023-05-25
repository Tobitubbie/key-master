import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {
  KeyBindingDirective,
  KeyBindingsContainerDirective,
  StrategyOptions,
  VisualizationStrategyOptions
} from "@key-master/ng-key-master";

@Component({
  selector: 'key-master-list',
  standalone: true,
  imports: [CommonModule, FormsModule, KeyBindingsContainerDirective, KeyBindingDirective],
  templateUrl: './list.component.html',
})
export class ListComponent {

  items = ['Tobias', 'Bernd', 'Alfred'];

  selected = new Set<string>([this.items[0]]);

  constructor(
    public readonly strategyOptions: StrategyOptions,
    public readonly visualizationStrategyOptions: VisualizationStrategyOptions
  ) {
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

  toggleSelection(item: string) {
    console.log("TOGGGLE")
    this.isSelected(item) ? this.deselect(item) : this.select(item);
  }

  isAllSelected() {
    return this.selected.size === this.items.length;
  }

  toggleSelectAll() {
    this.isAllSelected() ? this.deselectAll() : this.selectAll();
  }
}
