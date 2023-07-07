import {Container} from "./container";
import {NoopStrategy} from "./strategies/noop-strategy";
import {KeyBinding} from "./models";

class StubContainer extends Container {
  constructor() {
    super();
  }
}

describe('Container', () => {

  let container: Container;
  let keyBinding: KeyBinding;

  beforeEach(() => {
    container = new StubContainer();
    keyBinding = {
      key: 'a',
      action: () => {/*noop*/},
      label: 'a',
      multi: false,
    };
  });

  it('should create an instance with defaults', () => {
    expect(container).toBeDefined();
    expect(container.ignoreTargets).toEqual([]);
    expect(container.name).toBeUndefined();
    expect(container.element).toBeUndefined();
    expect(container.strategy).toBeInstanceOf(NoopStrategy);
  });

  it('should add a key binding', () => {
    container.addKeyBinding(keyBinding);
    expect(container.keyBindings()).toEqual([keyBinding]);
  });

  it('should throw error on duplicate key binding', () => {
    container.addKeyBinding(keyBinding);
    expect(() => container.addKeyBinding(keyBinding)).toThrow(/.*binding for key .* already exists/i);
  });

  it('should add multiple multi key bindings', () => {
    const multiKeyBinding = {...keyBinding, multi: true};
    container.addKeyBinding(multiKeyBinding);
    container.addKeyBinding(multiKeyBinding);
    expect(container.keyBindings()).toEqual([multiKeyBinding, multiKeyBinding]);
  });

  it('should remove a key binding', () => {
    container.addKeyBinding(keyBinding);
    container.removeKeyBinding(keyBinding);
    expect(container.keyBindings()).toEqual([]);
  });

  it('should return parents and itself on discoverParentContainers', () => {
    const parents: Container[] = [
      new StubContainer(),
      new StubContainer(),
    ];
    const spy = jest.spyOn(container.strategy, 'discoverParentContainers').mockReturnValue(parents);

    expect(container.discoverParentContainers()).toEqual([...parents, container]);
    expect(spy).toHaveBeenCalled();
  });

  describe('onKeyboardEvent', () => {

    it('should call action on matching key binding', () => {
      const spy = jest.spyOn(keyBinding, 'action');
      container.addKeyBinding(keyBinding);
      container.onKeyboardEvent(new KeyboardEvent('keydown', {key: keyBinding.key}));
      expect(spy).toHaveBeenCalled();
    });

    it('should not call action on non-matching key binding', () => {
      const spy = jest.spyOn(keyBinding, 'action');
      container.addKeyBinding(keyBinding);
      container.onKeyboardEvent(new KeyboardEvent('keydown', {key: 'b'}));
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call action if multi key binding\'s element contains active element', () => {
      keyBinding.multi = true;
      keyBinding.element = document.createElement('div');
      jest.spyOn(keyBinding.element, 'contains').mockReturnValue(true);
      const spy = jest.spyOn(keyBinding, 'action');
      const keyboardEvent = new KeyboardEvent('keydown', {key: keyBinding.key});

      container.addKeyBinding(keyBinding);
      container.onKeyboardEvent(keyboardEvent);

      expect(spy).toHaveBeenCalled();
    });

    it('should not call action if multi key binding\'s element does not contain active element', () => {
      keyBinding.multi = true;
      keyBinding.element = document.createElement('div');
      jest.spyOn(keyBinding.element, 'contains').mockReturnValue(false);
      const spy = jest.spyOn(keyBinding, 'action');
      const keyboardEvent = new KeyboardEvent('keydown', {key: keyBinding.key});

      container.addKeyBinding(keyBinding);
      container.onKeyboardEvent(keyboardEvent);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should ignore event if target is in ignoreTargets', () => {
      const spy = jest.spyOn(keyBinding, 'action');
      container.addKeyBinding(keyBinding);
      container.ignoreTargets.push(HTMLInputElement);

      const keyboardEvent: Partial<KeyboardEvent> = {
        key: keyBinding.key,
        target: document.createElement('input'),
      };

      container.onKeyboardEvent(keyboardEvent as KeyboardEvent);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should pass handled event to strategy', () => {
      const spy = jest.spyOn(container.strategy, 'handleKeyBoardEvent');
      const keyboardEvent = new KeyboardEvent('keydown', {key: keyBinding.key});

      container.addKeyBinding(keyBinding);
      container.onKeyboardEvent(keyboardEvent);

      expect(spy).toHaveBeenCalledWith(keyboardEvent, true);
    });

    it('should pass unhandled event to strategy', () => {
      const spy = jest.spyOn(container.strategy, 'handleKeyBoardEvent');
      const keyboardEvent = new KeyboardEvent('keydown', {key: 'b'});

      container.addKeyBinding(keyBinding);
      container.onKeyboardEvent(keyboardEvent);

      expect(spy).toHaveBeenCalledWith(keyboardEvent, false);
    });
  });
});
