import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KeyBindingDirective, KeyBindingsContainerDirective} from "@key-master/ng-key-master";

@Component({
  selector: 'key-master-dynamic',
  standalone: true,
  imports: [CommonModule, KeyBindingsContainerDirective, KeyBindingDirective],
  templateUrl: './dynamic.component.html',
})
export class DynamicComponent {

  showContent = false;
  showMoreContent = false;

  run() {
    console.log("Dynamic Keybinding triggered!");
  }
}
