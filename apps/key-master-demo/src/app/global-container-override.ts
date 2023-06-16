import {GlobalContainer} from "@key-master/ng-key-master";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class GlobalContainerOverride extends GlobalContainer {

  override name = 'FancyOverriddenGlobalContainer';

  constructor() {
    super();
    console.log("GlobalContainer got overridden")
  }

}
