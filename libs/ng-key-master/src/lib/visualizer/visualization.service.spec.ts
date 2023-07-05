import {TestBed} from "@angular/core/testing";
import {signal} from "@angular/core";
import {containerNameFallback, VisualizationService} from "./visualization.service";
import {Container} from "../container";
import {KeyMasterService} from "../key-master.service";
import {provideKeyMaster} from "../providers";
import {KeyBinding} from "../models";


class StubContainer extends Container {
  override keyBindings = signal<KeyBinding[]>([]);

  constructor() {
    super();
  }
}

describe('VisualizationService', () => {
  let service: VisualizationService;
  const activeContainers = signal<Container[]>([]);

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      providers: [
        provideKeyMaster(),
        {
          provide: KeyMasterService,
          useValue: {
            activeContainers,
          }
        },
      ],
    });

    activeContainers.set([]);
    service = TestBed.inject(VisualizationService);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });


  it('should be initially closed', () => {
    expect(service.isOpen()).toBe(false);
  });

  it('should toggle', () => {
    const showSpy = jest.spyOn(service, 'showOverlay');
    const hideSpy = jest.spyOn(service, 'hideOverlay');

    service.toggleOverlay();
    expect(showSpy).toHaveBeenCalled();
    expect(service.isOpen()).toBe(true);

    service.toggleOverlay();
    expect(hideSpy).toHaveBeenCalled();
    expect(service.isOpen()).toBe(false);
  });

  describe('Active Keybindings', () => {

    it('should compute active key bindings on active containers change', () => {
      activeContainers.set([new StubContainer()]);
      expect(service.activeKeyBindings().size).toBe(1);
      activeContainers.set([]);
      expect(service.activeKeyBindings().size).toBe(0);
    });

    it('should group key bindings by container', () => {
      const keyBindings = [
        {
          key: 'a',
          action: () => {
            /*noop*/
          }
        },
        {
          key: 'b',
          action: () => {
            /*noop*/
          }
        },
      ];
      const unnamedContainer = new StubContainer();
      unnamedContainer.keyBindings.set(keyBindings);
      const namedContainer = new StubContainer();
      namedContainer.keyBindings.set(keyBindings);
      namedContainer.name = 'named';

      activeContainers.set([unnamedContainer, namedContainer]);

      expect(service.activeKeyBindings().get(namedContainer.name)).toEqual(keyBindings);
      expect(service.activeKeyBindings().get(containerNameFallback)).toEqual(keyBindings);
    });

    it('should distinct key bindings by key', () => {
      const keyBindings = [
        {
          key: 'a',
          label: 'first kb',
          action: () => {
            /*noop*/
          }
        },
        {
          key: 'a',
          label: 'second kb',
          action: () => {
            /*noop*/
          }
        },
      ];

      const container = new StubContainer();
      container.name = 'my-container';
      container.keyBindings.set(keyBindings);

      activeContainers.set([container]);

      expect(service.activeKeyBindings().get(container.name)).toEqual([keyBindings[0]]);
      expect(service.activeKeyBindings().get(container.name)?.[0].label).toEqual('first kb');
    });

  });

  describe('Refresh Visualizations', () => {

    // signal effects not working in jest -> calling refreshVisualizations manually -> TODO rewrite when fixed

    const getStrategyMock = () => {
      return {
        show: jest.fn(),
        hide: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn(),
      }
    }

    let keyBindings: KeyBinding[];

    beforeEach(() => {
      keyBindings = [
        {
          key: 'a',
          action: () => {
            /*noop*/
          },
          strategy: getStrategyMock(),
          element: document.createElement('div'),
        },
        {
          key: 'b',
          action: () => {
            /*noop*/
          },
          strategy: getStrategyMock(),
          element: document.createElement('div'),
        },
      ];
    });

    it('should create new strategies', () => {
      service.refreshVisualizations(keyBindings);
      keyBindings.forEach(kb => {
        expect(kb.strategy?.create).toHaveBeenCalledTimes(1);
      });
    });

    it('should destroy old strategies', () => {
      service.refreshVisualizations(keyBindings);
      service.refreshVisualizations([]);
      keyBindings.forEach(kb => {
        expect(kb.strategy?.destroy).toHaveBeenCalledTimes(1);
      });
    });

    it('should re-create unchanged strategies', () => {
      service.refreshVisualizations(keyBindings);
      service.refreshVisualizations(keyBindings);
      keyBindings.forEach(kb => {
        expect(kb.strategy?.create).toHaveBeenCalledTimes(2);
      });
    });

    it('should not destroy unchanged strategies', () => {
      service.refreshVisualizations(keyBindings);
      service.refreshVisualizations(keyBindings);
      keyBindings.forEach(kb => {
        expect(kb.strategy?.destroy).toHaveBeenCalledTimes(0);
      });
    });

    it('should show/hide strategies if opened/closed', () => {
      service.showOverlay();
      service.refreshVisualizations(keyBindings);
      keyBindings.forEach(kb => {
        expect(kb.strategy?.show).toHaveBeenCalled();
      });
    });

    it('should hide strategies if closed', () => {
      service.hideOverlay();
      service.refreshVisualizations(keyBindings);
      keyBindings.forEach(kb => {
        expect(kb.strategy?.hide).toHaveBeenCalled();
      });
    });

  });

});
