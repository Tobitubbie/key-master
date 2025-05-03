import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Observable} from 'rxjs';
import {
  ACTIVE_ELEMENT,
  ActiveElement,
  AnnouncerService,
  KeyBinding,
  KeyBindingDirective,
  KeyBindingsContainerDirective,
  KeyMasterService,
  StrategyOptions,
  VisualizationService,
  VisualizationStrategyOptions,
} from '@key-master/ng-key-master';
import {TextareaComponent} from "./textarea/textarea.component";
import {NgForOf} from "@angular/common";
import {ListComponent} from "./list/list.component";
import {DynamicComponent} from "./dynamic/dynamic.component";
import {WrappedListComponent} from "./list-navigation-wrapper/wrapped-list/wrapped-list.component";
import {AliasSymbolsComponent} from "./alias-symbols/alias-symbols.component";


@Component({
  standalone: true,
  imports: [
    RouterModule,
    TextareaComponent,
    NgForOf,
    KeyBindingsContainerDirective,
    KeyBindingDirective,
    ListComponent,
    DynamicComponent,
    WrappedListComponent,
    AliasSymbolsComponent,
  ],
  selector: 'key-master-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  // for removal of dynamically added global keybindings
  globalKeyBindings: KeyBinding[] = [];

  constructor(
    @Inject(ACTIVE_ELEMENT)
    public readonly activeElement$: Observable<ActiveElement>,
    public readonly keyMasterService: KeyMasterService,
    public readonly overlayService: VisualizationService,
    public readonly strategyOptions: StrategyOptions,
    public readonly visualizationStrategyOptions: VisualizationStrategyOptions,
    public readonly announcerService: AnnouncerService,
  ) {
  }

  announceCounter = 0;

  async announce() {
    await this.announcerService.announce(`TEEEEEEEEEEST called${this.announceCounter++}`, 'assertive');
  }

  ngOnInit() {
    [
      {
        key: 'F2',
        label: 'Hilfe anzeigen/ausblenden',
        action: () => this.overlayService.toggleOverlay(),
      },
      {
        key: 'ctrl + option + right',
        label: 'Nächste Hilfeseite',
        action: () => this.overlayService.nextPage(),
      },
      {
        key: 'ctrl + option + left',
        label: 'Vorherige Hilfeseite',
        action: () => this.overlayService.previousPage(),
      },
    ].forEach(key => {
      this.keyMasterService.globalContainer.addKeyBinding(key);
      this.globalKeyBindings.push(key);
    })

    this.announcerService.enable();
    this.overlayService.showOverlay();
  }

  getDummyAction(key: string): void {
    console.log(`${key} pressed!`);
  }

  onListElementClick(index: string) {
    console.log(`ListElement ${index} clicked`);
  }

  ngOnDestroy() {
    this.globalKeyBindings.forEach((keyBinding) =>
      this.keyMasterService.globalContainer.removeKeyBinding(keyBinding)
    );

    this.announcerService.disable();
  }
}
