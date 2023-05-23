import {Component} from '@angular/core';
import {
  KeyBinding,
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

  boldKeyBinding: KeyBinding = {
    key: 'ctrl+b',
    action: () => this.toggleBold(),
    label: 'Text Bold',
  };

  italicKeyBinding: KeyBinding = {
    key: 'ctrl+i',
    action: () => this.toggleItalic(),
    label: 'Text Italic',
  };

  toggleBold() {
    this.bold = !this.bold;
  }

  toggleItalic() {
    this.italic = !this.italic;
  }

}
