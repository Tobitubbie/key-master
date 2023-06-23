
/**
 * NOTES:
 * - inspired by https://github.com/ianstormtaylor/is-hotkey
 * - firefox only partially supported:
 *    - firefox does not set metaKey
 *    - firefox uses 'OS' as key instead of 'Meta'
 */

export type Modifier = 'alt' | 'control' | 'meta' | 'shift';

export const MODIFIERS: Record<Modifier, string> = {
  alt: 'altKey',
  control: 'ctrlKey',
  meta: 'metaKey',
  shift: 'shiftKey',
}

export const ALIASES: Record<string, string> = {
  add: '+',
  break: 'pause',
  del: 'delete',
  down: 'arrowdown',
  esc: 'escape',
  ins: 'insert',
  left: 'arrowleft',
  return: 'enter',
  right: 'arrowright',
  space: ' ',
  spacebar: ' ',
  up: 'arrowup',

  // Modifier-Aliases
  cmd: 'meta',
  command: 'meta',
  win: 'meta',
  windows: 'meta',
  os: 'meta',
  ctl: 'control',
  ctrl: 'control',
  opt: 'alt',
  option: 'alt',
}

export function keycodeMatchesEvent(keycode: string, event: KeyboardEvent): boolean {

  if (keycode.trim().length === 0) {
    return false;
  }

  const keys = keycode
    .toLowerCase()
    .replace(/\s+/g, '') // remove spaces
    .split('+')
    .map((key) => ALIASES[key] ? ALIASES[key] : key);

  const modifiers = keys.filter(isModifier).map(key => MODIFIERS[key]);
  const key = keys.filter(key => !isModifier(key)).pop();

  const modifiersPass = checkModifiers(event, modifiers);
  const keyPass = checkKey(event, key);

  return modifiersPass && keyPass;
}

function isModifier(key: string): key is Modifier {
  return key in MODIFIERS;
}

function checkModifiers(event: KeyboardEvent, modifiers: string[]): boolean {
  return event.ctrlKey === modifiers.includes('ctrlKey')
    && event.altKey === modifiers.includes('altKey')
    && (event.metaKey === modifiers.includes('metaKey') || event.getModifierState('OS') === modifiers.includes('metaKey')) // fixes firefox issue: windows-key no longer considered "meta" -> https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey
    && event.shiftKey === modifiers.includes('shiftKey');
}

function checkKey(event: KeyboardEvent, key: string | undefined): boolean {
  return key === undefined
    || (!isModifier(key) && key === event.key.toLowerCase());
}
