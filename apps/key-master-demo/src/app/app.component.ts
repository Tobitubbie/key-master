import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Observable} from 'rxjs';
import {
  ACTIVE_ELEMENT,
  ActiveElement,
  KeyBinding,
  KeyMasterService,
  NgKeyMasterModule,
  StrategyOptions,
  VisualizationService,
  VisualizationStrategy,
  VisualizationStrategyOptions,
} from '@key-master/ng-key-master';
import {TextareaComponent} from "./textarea/textarea.component";
import {NgForOf} from "@angular/common";

@Component({
  standalone: true,
  imports: [
    RouterModule,
    NgKeyMasterModule,
    TextareaComponent,
    NgForOf,
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
      key: 'F7', // Chrome's Keyboard-Navigation Shortcut
      label: 'Hilfe anzeigen/ausblenden',
      action: () => this.overlayService.toggleOverlay(),
    };
    this.keyMasterService.globalContainer.addKeyBinding(key);
    this.globalKeyBindings.push(key);
  }

  dummyKeyBinding(key: string, strategy?: VisualizationStrategy): KeyBinding {
    return {
      key,
      action: () => console.log(`${key} pressed!`),
      label: `TestCommand_${key}`,
      strategy: strategy,
    };
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
