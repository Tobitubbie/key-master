import {Container} from './container';
import {KeyBinding} from './models';


export function groupKeyBindingsByContainer(containers: Container[]): Map<string, KeyBinding[]> {
  const groups = new Map<string, KeyBinding[]>();
  containers.forEach((container) => groups.set(container.name, distinctByKey(container.keyBindings())));
  return groups;
}

export function distinctByKey(keyBindings: KeyBinding[]): KeyBinding[] {
  return keyBindings.filter(keyBinding => {
    return keyBindings.findIndex(kb => kb.key === keyBinding.key) === keyBindings.indexOf(keyBinding);
  })
}
