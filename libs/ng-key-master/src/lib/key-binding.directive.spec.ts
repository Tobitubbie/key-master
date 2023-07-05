import {TestBed} from "@angular/core/testing";
import {ElementRef, EventEmitter} from "@angular/core";
import {KeyBindingDirective} from "./key-binding.directive";
import {provideKeyMaster} from "./providers";
import {KeyMasterService} from "./key-master.service";
import {NoopVisualizationStrategy} from "./visualizer/visualization-strategies";
import {Container} from "./container";


describe('KeyBindingDirective', () => {
  let keyBindingDirective: KeyBindingDirective;
  let service: KeyMasterService;
  let elementRefMock: ElementRef<Element>

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      providers: [
        provideKeyMaster({
          defaultVisualizationStrategy: 'noop',
        }),
      ],
    });

    service = TestBed.inject(KeyMasterService);
    elementRefMock = {nativeElement: document.createElement('button')}

    TestBed.runInInjectionContext(() => {
      keyBindingDirective = new KeyBindingDirective(elementRefMock, service)
    });
  });

  it('should create an instance with defaults', () => {
    expect(keyBindingDirective).toBeDefined();
    expect(keyBindingDirective.key).toBeUndefined();
    expect(keyBindingDirective.label).toBeUndefined();
    expect(keyBindingDirective.strategy).toBeInstanceOf(NoopVisualizationStrategy);
    expect(keyBindingDirective.multi).toBe(false);
    expect(keyBindingDirective.action).toBeInstanceOf(EventEmitter<void>);
  });

  it('should throw an error if no container is found', () => {
    jest.spyOn(service, 'getParentContainerFromElement').mockReturnValue(undefined);
    expect(keyBindingDirective.ngAfterViewInit).toThrow();
  });

  it('should add key binding to container', () => {
    const containerSpy: Partial<Container> = {
      addKeyBinding: jest.fn(),
    };
    jest.spyOn(service, 'getParentContainerFromElement').mockReturnValue(containerSpy as Container);

    keyBindingDirective.ngAfterViewInit();

    expect(containerSpy.addKeyBinding).toHaveBeenCalled();
  });

  it('should remove key binding from container', () => {
    const containerSpy: Partial<Container> = {
      addKeyBinding: jest.fn(),
      removeKeyBinding: jest.fn(),
    };
    jest.spyOn(service, 'getParentContainerFromElement').mockReturnValue(containerSpy as Container);

    keyBindingDirective.ngAfterViewInit();
    keyBindingDirective.ngOnDestroy();

    expect(containerSpy.removeKeyBinding).toHaveBeenCalled();
  });

});
