import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Container } from './container';
import { IgnoreTarget, KeyBinding } from './models';
import { KeyMasterService } from './key-master.service';
import { Strategy, StrategyOptions } from './strategies';
import { DEFAULT_IGNORE_TARGETS } from './utils';

export const ADD_KEY_EVENT_NAME = 'removeKey';
export const REMOVE_KEY_EVENT_NAME = 'addKey';

export const KEY_BINDINGS_CONTAINER_SELECTOR = '[kmKeysContainer]';

@Directive({
  selector: '[kmKeysContainer]', // update KEY_BINDINGS_CONTAINER_SELECTOR on change
  standalone: true,
})
export class KeyBindingsContainerDirective
  extends Container
  implements OnInit, OnDestroy
{
  @Input()
  override ignoreTargets: IgnoreTarget[] = DEFAULT_IGNORE_TARGETS;

  @Input()
  override strategy: Strategy = this.strategyOptions.bubble();

  @Input()
  override name: string | undefined;

  override element = this.elementRef.nativeElement;

  constructor(
    private service: KeyMasterService,
    private strategyOptions: StrategyOptions,
    private elementRef: ElementRef<Element>
  ) {
    super();
  }

  ngOnInit() {
    this.registrationId = this.service.registerContainer(this);
  }

  ngOnDestroy() {
    if (this.registrationId) {
      this.service.deregisterContainer(this.registrationId);
    }
  }

  @HostListener(ADD_KEY_EVENT_NAME, ['$event'])
  onAddKey(event: CustomEvent<KeyBinding>) {
    super.addKeyBinding(event.detail);
  }

  @HostListener(REMOVE_KEY_EVENT_NAME, ['$event'])
  onRemoveKey(event: CustomEvent<KeyBinding>) {
    super.removeKeyBinding(event.detail);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    super.onKeyboardEvent(event);
  }
}
