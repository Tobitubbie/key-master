import {TestBed} from "@angular/core/testing";
import {KeyMasterService} from "./key-master.service";
import {provideKeyMaster} from "./providers";
import {Container} from "./container";
import {ACTIVE_ELEMENT} from "./tokens";
import {signal} from "@angular/core";


class StubContainer extends Container {
  override element = document.createElement('div');

  constructor() {
    super();
    this.element.setAttribute('kmKeysContainer', '');
  }
}

describe('KeyMasterService', () => {
  let service: KeyMasterService;
  const activeElement = signal<Element | null>(null);

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      providers: [
        provideKeyMaster(),
        {
          provide: ACTIVE_ELEMENT,
          useValue: activeElement,
        }
      ],
    });

    service = TestBed.inject(KeyMasterService);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should (de)register container', () => {
    const container = new StubContainer();

    service.registerContainer(container);
    expect(service.containers()).toContain(container);

    service.deregisterContainer(container);
    expect(service.containers()).not.toContain(container);
  });

  describe('getParentContainerFromElement', () => {

    it('should return parent container from element', () => {
      const element = document.createElement('div');
      const container = new StubContainer();
      container.element.appendChild(element);

      service.registerContainer(container);
      const parentContainer = service.getParentContainerFromElement(element);

      expect(parentContainer).toBe(container);
    });

    it('should return undefined if no parent container found', () => {
      const element = document.createElement('div');
      const container = new StubContainer();

      service.registerContainer(container);
      const parentContainer = service.getParentContainerFromElement(element);

      expect(parentContainer).toBeUndefined();
    });
  });

  describe('activeContainers', () => {

    it('should include global container if no parent container exists', () => {
      expect(service.activeContainers().length).toBe(1);
      expect(service.activeContainers()).toContain(service.globalContainer);
    });

    it('should include parent container', () => {
      const element = document.createElement('button');
      const container = new StubContainer();
      container.element.appendChild(element);

      service.registerContainer(container);
      activeElement.set(element);

      expect(service.activeContainers()).toContain(container);
    });

  });

});
