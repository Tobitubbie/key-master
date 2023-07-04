# ng-key-master

## Best Practices

- only use keys a-z, 0-9, f1-f12, arrow-keys
  - no numpad -> not available on all keyboards (e.g. notebooks)
  - no special keys (e.g. insert, delete, home, end, page up, page down) -> not available on all keyboards
  - no language specific keys (e.g. ä, ö, ü, ß)

- be careful using modifiers
  - meta should be avoided -> might conflict with os (e.g. windows) 
  - if used, call `preventDefault` to prevent browser shortcuts
  

## Active Element

Tracks the currently active element in the DOM.  
It keeps the last active element if the document / window loses focus.  


## KeyMasterService

Stores all containers including the global container.  
Multicasts the currently active containers.  
Can be used to determine the parent container relative to a given DOM-Element.


## Container

Single global container is automatically instantiated: `GlobalContainer`.  
Multiple further containers can be added by the user with the `KeyBindingsContainerDirective`.  

Containers (de-)register themselves at the `ActiveElementService`.

Keybindings can be added to / removed from the container.  
One of their actions is called if:
- the key matches the key event
- the event's target is not included in the list of ignored targets  

If multiple keybindings with the same key exist (`multi: true`) the action of the keybinding containing the active element is called.


## Container Strategies

Responsible for handling the propagation of the keyboard event and discovering parent containers

`StrategyOptions` can be used for easier usage, so no strategy must be manually instantiated with all its dependencies. 

### NoopStrategy
Does no operation.  

When discovering parent containers it returns an empty array.

### BubbleStrategy
Stops the event propagation if it has not been handled by the current container.  

When discovering parent containers it forwards the call to the parent or - if no more found - the global container.

### ExclusiveStrategy
Always stops the event propagation.  

When discovering parent containers it returns an empty array.

### MergeStrategy
Always stops the event propagation.  
Forwards the event to the global container if it has not been handled by the current container.  

When discovering parent containers it only returns the global container.


## (Multi)Keybinding

Adds/Removes itself to/from the closest container.  
If it is a multi keybinding it is added multiple times.  

Emits an event if its action is called (indirection with `@Output` for easier usage in the template).  
If it is a multi keybinding the actual function is called directly.  
> Note:
> Binding an `action` in a multi keybinding it's the best to use the `bind` function to avoid losing the `this` context.


## VisualizationService

Displays a global overlay for the active keybindings.  
Additionally calls `create`/`destroy` for each active keybindings strategy.  
Multicasts the currently active keybindings grouped by their containers and distinct by their keys.  

## Visualization-Strategies

A visualization strategy is responsible for displaying the keys of the currently active keybindings.

`VisualizationStrategyOptions` can be used for easier usage, so no visualization strategy must be manually instantiated with all its dependencies.

### NoopStrategy
Does no operation.

### OverlayStrategy
Displays the key as an overlay (similar to a tooltip) at the element where the keybinding directive is applied to.

### InlineStrategy
Displays the key as a text added to the end of the element where the keybinding directive is applied to.


## KeyCode

A small library for defining the shortcuts used by the keybindings `key` property.  
It is inspired by https://github.com/ianstormtaylor/is-hotkey.  

Firefox is the only partially supported due to the fact that the meta key is not properly set by the browser.  

`keycodeMatchesEvent` is the primary used to check if a keyboard event matches a given keycode.  

Different alias can be used for defining the keycodes.
E.g. `ctrl` as a shortname for `control`, or `meta` as an alias for `command` or `windows` to be OS independent.

