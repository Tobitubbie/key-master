import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { KeyBindingOverlayComponent } from './key-binding-overlay/key-binding-overlay.component';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule],
  declarations: [OverlayComponent, KeyBindingOverlayComponent],
  exports: [OverlayComponent, KeyBindingOverlayComponent],
})
export class NgKeyMasterVisualizerModule {}
