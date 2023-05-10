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
    key: 'B',
    action: () => this.toggleBold(),
    label: 'Text Bold',
    strategy: this.visualizationStrategyOptions.overlay(),
  };

  italicKeyBinding: KeyBinding = {
    key: 'I',
    action: () => this.toggleItalic(),
    label: 'Text Italic',
    strategy: this.visualizationStrategyOptions.inline(),
  };

  toggleBold() {
    this.bold = !this.bold;
  }

  toggleItalic() {
    this.italic = !this.italic;
  }

}
