import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Observable} from 'rxjs';
import {
  ACTIVE_ELEMENT,
  ActiveElement,
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

@Component({
  standalone: true,
  imports: [
    RouterModule,
    TextareaComponent,
    NgForOf,
    KeyBindingsContainerDirective,
    KeyBindingDirective,
    ListComponent,
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
  ) {
  }

  ngOnInit() {
    const key: KeyBinding = {
      key: 'F2',
      label: 'Hilfe anzeigen/ausblenden',
      action: () => this.overlayService.toggleOverlay(),
    };
    this.keyMasterService.globalContainer.addKeyBinding(key);
    this.globalKeyBindings.push(key);
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
  }
}
