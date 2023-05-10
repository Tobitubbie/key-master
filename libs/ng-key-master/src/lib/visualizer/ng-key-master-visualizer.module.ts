import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayComponent} from './overlay.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule],
  declarations: [OverlayComponent],
  exports: [OverlayComponent],
})
export class NgKeyMasterVisualizerModule {
}
