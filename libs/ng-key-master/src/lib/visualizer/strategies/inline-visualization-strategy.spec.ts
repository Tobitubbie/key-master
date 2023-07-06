import {InlineVisualizationStrategy} from "./inline-visualization-strategy";
import {Renderer2} from "@angular/core";
import {KeyBinding} from "../../models";
import * as keycode from "../../keycode/symbolizeKey.pipe";

const rendererMock: Partial<Renderer2> = {
  createElement: (name: string) => document.createElement(name),
  removeChild: (parent: Element, child: Element) => parent.removeChild(child),
  appendChild: (parent: Element, child: Element) => parent.appendChild(child),
  addClass: (element: Element, className: string) => element.classList.add(className),
  removeClass: (element: Element, className: string) => element.classList.remove(className),
};

describe('InlineVisualizationStrategy', () => {

  let strategy: InlineVisualizationStrategy;
  let keyBinding: KeyBinding;

  jest.spyOn(keycode, 'symbolizeKeycode').mockImplementation(x => x);

  beforeEach(() => {
    strategy = new InlineVisualizationStrategy(rendererMock as Renderer2);
    keyBinding = {
      key: 'a',
      action: () => {
        /*noop*/
      },
      strategy,
      element: document.createElement('button'),
    };
  });

  it('should instantiate', () => {
    expect(strategy).toBeTruthy();
    expect(strategy.element).toBeInstanceOf(HTMLSpanElement);
  });

  it('should create', () => {
    strategy.create(keyBinding);
    expect(strategy.element.textContent?.includes(keyBinding.key)).toBe(true);
    expect(keyBinding.element?.children).toContain(strategy.element);
  });

  it('should destroy', () => {
    strategy.create(keyBinding);
    strategy.destroy();
    expect(keyBinding.element?.children).not.toContain(strategy.element);
  });

  it('should show', () => {
    strategy.show();
    expect(strategy.element.classList).not.toContain('hidden');
  });

  it('should hide', () => {
    strategy.hide();
    expect(strategy.element.classList).toContain('hidden');
  });

});
