import {Inject, Injectable} from "@angular/core";
import {Container} from "./container";
import {GlobalContainerConfig} from "./models";
import {GLOBAL_CONTAINER_CONFIG} from "./tokens";
import {NoopStrategy} from "./strategies";


@Injectable({ providedIn: 'root'})
export class GlobalContainer extends Container {
  override ignoreTargets = this.globalConfig.ignoreTargets;
  override name = this.globalConfig.name;
  override element = this.globalConfig.element;
  override strategy = new NoopStrategy();

  constructor(
    @Inject(GLOBAL_CONTAINER_CONFIG) private readonly globalConfig: GlobalContainerConfig,
  ) {
    super();
    this.element.addEventListener('keydown', (event) => {
      if (event instanceof KeyboardEvent) this.onKeyboardEvent(event);
    });
  }

  override onKeyboardEvent(event: KeyboardEvent) {
    super.onKeyboardEvent(event);
  }
}
