import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgKeyMasterVisualizerModule} from "./visualizer/ng-key-master-visualizer.module";

@NgModule({
  imports: [
    CommonModule,
    NgKeyMasterVisualizerModule,
  ],
})
export class NgKeyMasterModule {
}
