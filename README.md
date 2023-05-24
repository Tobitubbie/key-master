# Angular - KeyMaster

## Ziel:
Usern die Interaktionsmöglichkeiten mit der Tastatur näher bringen.
Dabei möglichst unaufdringlich sein.
-> Wenn der User es nicht möchte ist es in der UI verborgen (abgesehen Trigger(-Info))

## Trigger:
Ein einfacher Text, der dem User den Shortcut für die Hilfe verrät.
Zb: "Drücken Sie F10 für Tastatur-Bedienung".

## UI:
Rechts oben wird in halbtransperenten, dunklen kreisförmigen punkten mit weißem text der tastenkürzel für das akutelle bedien-segment / den aktuellen "control-container".
Besseres Icon: Tastensymbol + entsprechendem Wert (zB. "Q"-Taste)

## Verhalten:
- Tastenkombination wird im nähesten Container gesucht
- Container steuert konfigurativ, ob Tastenkombinationen "bubbeln" dürfen
- Error bei gleichen Tastenkombinationen innerhalb eines Containers (zB. bei Registrierung)


## Problemstellungen:
- Wie kann ich erkennen, dass der Browser-Fokus in einem Bereich ist?
  > Auszug aus Quelle "StackBlitz / Playground":
  ```javascript
  const htmlElement: HTMLElement = document.getElementById('container-id');
  htmlElement.contains(document.activeElement);
  ```

- Gibt es einen Workaround für den Delay der 3rd-Party-Lib?

## Quellen:
- [StackBlitz / Playground](https://stackblitz.com/edit/ngt-27dp4j?file=src/app/app.ts)
- [npm Package](https://www.npmjs.com/package/ng-keyboard-shortcuts)

## Begriffe:
### control-container
bereich im html (konkreter: div oder section) in dem bestimmte tastenkombinationen "list-of-actions" möglich sind.
```typescript
type ControlContainer = {
    
}
```


### tastenkombination:
tripel aus tasten-key, function und
subAt(control-container) ("<- nochmal drüber nachdenken").   
die function wird aufgerufen, sobald press(tasten-key) erfolgt.
```typescript
type Shortcut = { 
    key: Key;
    action: VoidFunction;
}

```

subAt(controler-container) dient der registrierung beim controler-container für eine abstraktere steuerung (durch/von?) diensten (zB. die UI/Anzeige)


## Idee: Auto-Zuweisung KeyBinding -> KeysContainer
Aktuell: Man muss bei einem KeyBinding zusätzlich den zugehörigen Container-Namen angeben.
Diese explizite Angabe könnte man automatisch ermitteln mittels der Element-Methode `closest`:
```typescript
const elementWithKeyBinding: HTMLElement;

const nearestParentContainer = elementWithKeyBinding.closest('[keysContainer]');
```

MDN-Doku:
https://developer.mozilla.org/en-US/docs/Web/API/Element/closest?retiredLocale=de


## Idee: Konfiguration
Man übergibt der Lib eine "GroupOfControls":
```typescript
type GroupOfControls = {
    name: string,
    controls: Array<Control>
}

type Control = {
  "control-container-name": string, // eine id (besser: ein attr zB "controlContainer") of the "control-container"
  "list-of-actions": ListOfActions, // ein Array<Action>
}
```

### Verhalten
Die "controls" einer "GroupOfControls" sind dann aktiv, wenn das attr. "name" gleich dem globalen (im [Service](#service)) prop "activeGroupName" ist.

### Service
```typescript
// ControllerService 
let I_ControllerService: {
    
    // Variables
    activeControls: GroupOfControls
    controls: Map< Pick<GroupOfControls, 'name'>, GroupOfControls >
  
    // Controll-Functions
    registerControls: (controls: GroupOfControls) => VoidFunction
    
  
    // Getter
    getActions: () => Array<Actions>
  
}
```

_tbd..._

## Untersuchung: ng-keyboard-shortcuts
- [npm](https://www.npmjs.com/package/ng-keyboard-shortcuts)
- [GitHub](https://github.com/omridevk/ng-keyboard-shortcuts)

**Con:**
- Shortcuts werden über KeyboardShortcutsComponent registriert
- KeyboardShortcutsSelectService nur mit ViewChild auf KeyboardShortcutsComponent verwendbar
- Mehrfach-Belegung von Tastenkombinationen möglich (Wann sollte das gewollt sein? / Use-Case?)

**Pro:**
- Shortcut "toggling" über die Anzeige der KeyboardShortcutsComponent möglich
- Keine Mehrfach-Belegung möglich
  - Letzte Registrierung "gewinnt"
  - Ausnahme: Weitere Registrierungen direkt über Service (Aber: Ausführung beider Funktionalität!)
- Shortcuts können auf ein bestimmtes Target restriktiert werden
  - Aber: explizit auf "fokusierbares" HTML-Element nötig, KEIN "container"-ähnliches System


