import {keycodeMatchesEvent, MODIFIERS} from "./keycode";

describe('CustomKeycodes', () => {

  it('should match single key (case-insensitive)', () => {
    const keys = ['a', 'A', 'b', 'B', 'y', 'Y', 'z', 'Z', 'ö', 'Ö'];

    keys.forEach(key => {
      const event = new KeyboardEvent('keydown', {key});
      expect(keycodeMatchesEvent(key, event)).toBe(true);
    });
  });

  it('should match single modifier', () => {
    Object.entries(MODIFIERS).forEach(([key, value]) => {
      const event = new KeyboardEvent('keydown', {
        key: key.charAt(0).toUpperCase() + key.slice(1), // capitalize first letter
        [value]: true
      });
      expect(keycodeMatchesEvent(key, event)).toBe(true);
    });
  });

  it('should match multiple modifiers', () => {
    const event = new KeyboardEvent('keydown', {
      metaKey: true,
      altKey: true,
    });
    expect(keycodeMatchesEvent('meta+alt', event)).toBe(true);
  });

  it('should match combination', () => {
    const event = new KeyboardEvent('keydown', {
      ctrlKey: true,
      key: 'a',
    });
    expect(keycodeMatchesEvent('ctrl+a', event)).toBe(true);
  });

  it('should match combination with multiple modifiers', () => {
    const event = new KeyboardEvent('keydown', {
      ctrlKey: true,
      shiftKey: true,
      key: 'a',
    });
    expect(keycodeMatchesEvent('ctrl+shift+a', event)).toBe(true);
  });

  it('should remove spaces', () => {
    const event = new KeyboardEvent('keydown', {
      ctrlKey: true,
      key: 'a',
    });
    expect(keycodeMatchesEvent('ctrl  +    a', event)).toBe(true);
  });

  it('should translate aliases', () => {
    const event = new KeyboardEvent('keydown', {
      metaKey: true,
      key: 'ArrowRight',
    });
    expect(keycodeMatchesEvent('meta + right', event)).toBe(true);
    expect(keycodeMatchesEvent('cmd + right', event)).toBe(true);
    expect(keycodeMatchesEvent('command + right', event)).toBe(true);
    expect(keycodeMatchesEvent('win + right', event)).toBe(true);
    expect(keycodeMatchesEvent('windows + right', event)).toBe(true);
  });

  it('should reject unintended modifiers', () => {
    const event = new KeyboardEvent('keydown', {
      ctrlKey: true,
      shiftKey: true,
      key: 'a',
    });
    expect(keycodeMatchesEvent('ctrl+a', event)).toBe(false);
  });

  it('should reject empty keycode', () => {
    const event = new KeyboardEvent('keydown', {key: ''});
    expect(keycodeMatchesEvent('', event)).toBe(false);
  });

});
