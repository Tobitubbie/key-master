import {Directive, ElementRef, HostListener, inject, Input, OnDestroy, OnInit,} from '@angular/core';
import {Container} from './container';
import {IgnoreTarget} from './models';
import {KeyMasterService} from './key-master.service';
import {DEFAULT_CONTAINER_NAME, DEFAULT_CONTAINER_STRATEGY, DEFAULT_IGNORE_TARGETS} from "./tokens";
import {Strategy} from "./strategies/strategy";


export const KEY_BINDINGS_CONTAINER_SELECTOR = '[kmKeysContainer]';

@Directive({
  selector: '[kmKeysContainer]', // update KEY_BINDINGS_CONTAINER_SELECTOR on change
  standalone: true,
})
export class KeyBindingsContainerDirective extends Container implements OnInit, OnDestroy {

  @Input()
  override ignoreTargets: IgnoreTarget[] = inject(DEFAULT_IGNORE_TARGETS);

  @Input()
  override strategy: Strategy = inject(DEFAULT_CONTAINER_STRATEGY)();

  @Input()
  override name: string = inject(DEFAULT_CONTAINER_NAME);

  override element = this.elementRef.nativeElement;

  constructor(
    private service: KeyMasterService,
    private elementRef: ElementRef<Element>
  ) {
    super();
  }

  ngOnInit() {
    this.service.registerContainer(this);
  }

  ngOnDestroy() {
    this.service.deregisterContainer(this);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    super.onKeyboardEvent(event);
  }
}
