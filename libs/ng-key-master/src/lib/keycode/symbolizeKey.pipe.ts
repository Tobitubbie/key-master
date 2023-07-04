import {Pipe, PipeTransform} from '@angular/core';
import {ALIASES, isModifier, Modifier} from "./keycode";

const IS_MAC = (/Mac|iPod|iPhone|iPad/.test(window?.navigator?.platform?.toLowerCase()));

const MODIFIER_SYMBOLS: Record<Modifier, string> = {
  alt: IS_MAC ? '⌥' : 'Alt',
  control: IS_MAC ? '⌃' : 'Ctrl',
  meta: IS_MAC ? '⌘' : '⊞',
  shift: '⇧',
}

const KEY_SYMBOLS: Record<string, string> = {
  'arrowup': '↑',
  'arrowdown': '↓',
  'arrowleft': '←',
  'arrowright': '→',
  'backspace': IS_MAC ? '⌫' : '⟵',
  'delete': '⌦',
  'enter': '↵',
  'escape': IS_MAC ? '⎋' : 'Esc',
  'tab': '⇥',
  ' ': '␣',
  'capslock': '⇪',
  'home': '⤒',
  'end': '⤓',
  'pageup': '▲',
  'pagedown': '▼',
}

export function symbolizeKeycode(keycode: string) {
  const parsedKeycode = keycode
    .toLowerCase()
    .replace(/\s+/g, '')
    .split('+')
    .map(key => ALIASES[key] || key);

  const modifiers = parsedKeycode
    .filter(isModifier)
    .map(key => MODIFIER_SYMBOLS[key])
    .sort();

  const keys = parsedKeycode.filter(key => !isModifier(key))
    .map(key => KEY_SYMBOLS[key] || key)
    .map(k => k.toUpperCase());

  const separator = modifiers.length > 0 && keys.length > 0 ? '+' : '';

  return `${modifiers.join(' ')} ${separator} ${keys.join(' ')}`.trim();
}


@Pipe({
  name: 'symbolizeKey',
  standalone: true,
})
export class SymbolizeKeyPipe implements PipeTransform {
  transform(keycode: string, ..._args: unknown[]): string {
    return symbolizeKeycode(keycode);
  }
}
