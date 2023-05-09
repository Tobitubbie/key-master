import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { KeyBindingDirective } from './key-binding.directive';
import {NgKeyMasterVisualizerModule} from "./visualizer/ng-key-master-visualizer.module";
import {KeyBindingsContainerDirective} from "./key-bindings-container.directive";

@NgModule({
  imports: [
    CommonModule,
    NgKeyMasterVisualizerModule,
  ],
  declarations: [
    KeyBindingsContainerDirective,
    KeyBindingDirective,
  ],
  exports: [
    KeyBindingsContainerDirective,
    KeyBindingDirective,
  ]
})
export class NgKeyMasterModule {
}
