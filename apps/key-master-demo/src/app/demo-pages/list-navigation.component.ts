import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {
  KeyBindingsContainerDirective,
  KeyMasterService,
  MultiKeyBindingsDirective, StrategyOptions,
  VisualizationService, VisualizationStrategy, VisualizationStrategyOptions
} from '@key-master/ng-key-master';

@Component({
  selector: 'key-master-list-navigation',
  standalone: true,
  imports: [CommonModule, KeyBindingsContainerDirective, MultiKeyBindingsDirective],
  templateUrl: './list-navigation.component.html',
  styleUrl: './list-navigation.component.scss',
})
export class ListNavigationComponent implements OnInit {

  keyMasterService = inject(KeyMasterService);
  strategyOptions = inject(StrategyOptions);
  visualizationService = inject(VisualizationService);
  visualizationStrategyOptions = inject(VisualizationStrategyOptions);

  cursor = 0;
  planets: Array<{ label: string, selected: boolean }> = [
    {label: 'Mercury', selected: false},
    {label: 'Venus', selected: false},
    {label: 'Earth', selected: false},
    {label: 'Mars', selected: false},
    {label: 'Jupiter', selected: false},
    {label: 'Saturn', selected: false},
    {label: 'Uranus', selected: false},
    {label: 'Neptune', selected: false},
    // Pluto <3
  ];

  listKeyMap: Array<{key: string; action: VoidFunction; label?: string; strategy?: VisualizationStrategy; multi?: boolean }> = [
    { key: 'ArrowUp', action: this.movePrevious.bind(this), label: 'Vorheriges Element auswählen' },
    { key: 'ArrowDown', action: this.moveNext.bind(this), label: 'Nächstes Element auswählen' },
    { key: 'Enter', action: this.toggle.bind(this), label: 'Element (de)selektieren' },

    // enter-alias: space (nooped visualization)
    { key: 'Space', action: this.toggle.bind(this), label: 'Element (de)selektieren',
      strategy: this.visualizationStrategyOptions.noop()
    },
  ];

  toggle() {
    this.planets[this.cursor].selected = !this.planets[this.cursor].selected;
  }
  moveNext() {
    this.cursor+1 >= this.planets.length ? this.cursor = this.planets.length-1 : this.cursor++;
  }
  movePrevious() {
    this.cursor-1 < 0 ? this.cursor = 0 : this.cursor--;
  }

  ngOnInit() {

    this.keyMasterService.globalContainer.addKeyBinding({
      key: 'F2',
      label: 'Hilfe anzeigen/ausblenden',
      action: () => this.visualizationService.toggleOverlay(),
    })
  }
}
