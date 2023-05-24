import {Component} from '@angular/core';
import {
  KeyBindingDirective,
  KeyBindingsContainerDirective,
  StrategyOptions,
  VisualizationStrategyOptions
} from '@key-master/ng-key-master';

@Component({
  selector: 'key-master-textarea',
  templateUrl: './textarea.component.html',
  standalone: true,
  imports: [KeyBindingsContainerDirective, KeyBindingDirective]
})
export class TextareaComponent {

  constructor(
    public readonly strategyOptions: StrategyOptions,
    public readonly visualizationStrategyOptions: VisualizationStrategyOptions
  ) {
  }

  bold = false;
  italic = false;

  toggleBold = () => this.bold = !this.bold;

  toggleItalic(x: string) {
    this.italic = !this.italic;
    this.printSomething(x);
  }

  printSomething(thing: string): void {
    console.log(`Printing Something: ${thing}`, this.bold, this.italic);
  }
}
