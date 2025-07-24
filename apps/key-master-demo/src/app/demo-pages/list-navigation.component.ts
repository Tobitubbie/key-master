import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  KeyBindingDirective,
  KeyBindingsContainerDirective,
  KeyMasterService,
  MultiKeyBindingsDirective,
  VisualizationService,
  VisualizationStrategy,
  VisualizationStrategyOptions
} from '@key-master/ng-key-master';

@Component({
  selector: 'key-master-list-navigation',
  standalone: true,
  imports: [CommonModule, KeyBindingsContainerDirective, MultiKeyBindingsDirective, KeyBindingDirective],
  templateUrl: './list-navigation.component.html',
  styleUrl: './list-navigation.component.scss'
})
export class ListNavigationComponent implements OnInit {

  mode: 'grouped' | 'separated' = 'separated';

  keyMasterService = inject(KeyMasterService);
  visualizationService = inject(VisualizationService);
  visualizationStrategyOptions = inject(VisualizationStrategyOptions);

  cursor = 0;
  planets: Array<{ label: string, selected: boolean }> = [
    { label: 'Mercury', selected: false },
    { label: 'Venus', selected: false },
    { label: 'Earth', selected: false },
    { label: 'Mars', selected: false },
    { label: 'Jupiter', selected: false },
    { label: 'Saturn', selected: false },
    { label: 'Uranus', selected: false },
    { label: 'Neptune', selected: false }
    // Pluto <3
  ];
  lastSavedPlanets = <Array<string>>[];

  listKeyMap: Array<{
    key: string;
    action: VoidFunction;
    label?: string;
    strategy?: VisualizationStrategy;
    multi?: boolean
  }> = [
    { key: 'ArrowUp', action: this.movePrevious.bind(this), label: 'Vorheriges Element auswählen' },
    { key: 'ArrowDown', action: this.moveNext.bind(this), label: 'Nächstes Element auswählen' },
    { key: 'Space', action: this.toggle.bind(this), label: 'Element (de)selektieren' },
  ];

  ngOnInit() {
    this.keyMasterService.globalContainer.addKeyBinding({
      key: 'F2',
      label: 'Hilfe anzeigen/ausblenden',
      action: () => this.visualizationService.toggleOverlay()
    });
    this.keyMasterService.globalContainer.addKeyBinding({
      key: 'ctrl + option + right',
      label: 'Nächste Hilfeseite',
      action: () => this.visualizationService.nextPage()
    });
    this.keyMasterService.globalContainer.addKeyBinding({
      key: 'ctrl + option + left',
      label: 'Vorherige Hilfeseite',
      action: () => this.visualizationService.previousPage()
    });
  }

  // Cursor-Movement
  toggle() {
    this.planets[this.cursor].selected = !this.planets[this.cursor].selected;
  }

  moveNext() {
    this.cursor + 1 >= this.planets.length ? this.cursor = this.planets.length - 1 : this.cursor++;
  }

  movePrevious() {
    this.cursor - 1 < 0 ? this.cursor = 0 : this.cursor--;
  }

  // List-Actions
  saveSelection() {
    const selectedPlanets = this.planets.filter(planet => planet.selected);
    console.log('Saving selected Planets:', selectedPlanets);
    this.lastSavedPlanets = selectedPlanets.map(p => p.label);
  }

  resetSelection() {
    this.planets.forEach(planet => planet.selected = false);
    this.cursor = 0;
    this.lastSavedPlanets = [];
  }

  // Mode
  toggleMode() {
    this.mode = this.mode === 'grouped' ? 'separated' : 'grouped';
  }

}
