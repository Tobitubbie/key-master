import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { KeyBindingDirective } from './key-binding.directive';
import {NgKeyMasterVisualizerModule} from "./visualizer/ng-key-master-visualizer.module";

@NgModule({
  imports: [
    CommonModule,
    NgKeyMasterVisualizerModule,
  ],
  declarations: [
    KeyBindingDirective,
  ],
  exports: [
    KeyBindingDirective,
  ]
})
export class NgKeyMasterModule {
}
