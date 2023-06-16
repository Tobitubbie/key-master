import {inject, Injectable} from "@angular/core";
import {Container} from "./container";
import {GLOBAL_CONTAINER_CONFIG} from "./tokens";
import {NoopStrategy} from "./strategies";


@Injectable({providedIn: 'root'})
export class GlobalContainer extends Container {

  #config = inject(GLOBAL_CONTAINER_CONFIG);

  override ignoreTargets = this.#config.ignoreTargets;
  override name = this.#config.name;
  override element = this.#config.element;
  override strategy = new NoopStrategy();

  constructor() {
    super();
    this.element.addEventListener('keydown', (event) => {
      if (event instanceof KeyboardEvent) this.onKeyboardEvent(event);
    });
  }
}
