import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ALIASES} from "@key-master/ng-key-master";
import {SymbolizeKeyPipe} from "@key-master/ng-key-master";

@Component({
  selector: 'key-master-alias-symbols',
  standalone: true,
  imports: [CommonModule, SymbolizeKeyPipe],
  templateUrl: './alias-symbols.component.html',
})
export class AliasSymbolsComponent {
  aliases = Object.keys(ALIASES);
}
