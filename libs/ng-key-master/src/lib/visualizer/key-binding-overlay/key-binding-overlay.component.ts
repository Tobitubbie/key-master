import { Component, Inject, InjectionToken } from '@angular/core';
import { KeyBinding } from '../../models';
import { transition, trigger, useAnimation } from '@angular/animations';
import { zoomIn } from '../animations';

export type KeyBindingOverlayData = KeyBinding;
export const KEY_BINDING_OVERLAY_DATA =
  new InjectionToken<KeyBindingOverlayData>('KEY_BINDING_OVERLAY_DATA');

@Component({
  selector: 'km-key-binding-overlay',
  templateUrl: './key-binding-overlay.component.html',
  animations: [trigger('zoom', [transition(':enter', useAnimation(zoomIn))])],
  standalone: true,
})
export class KeyBindingOverlayComponent {
  constructor(
    @Inject(KEY_BINDING_OVERLAY_DATA) public keyBinding: KeyBindingOverlayData
  ) {}
}
