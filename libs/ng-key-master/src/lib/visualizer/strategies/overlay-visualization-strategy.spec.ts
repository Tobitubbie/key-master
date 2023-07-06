import {TestBed} from "@angular/core/testing";
import {KeyBinding} from "../../models";
import * as keycode from "../../keycode/symbolizeKey.pipe";
import {KEY_BINDING_OVERLAY_DATA,} from "../key-binding-overlay/key-binding-overlay.component";
import {Overlay} from "@angular/cdk/overlay";
import {OverlayVisualizationStrategy} from "./overlay-visualization-strategy";
import {provideNoopAnimations} from "@angular/platform-browser/animations";


describe('OverlayVisualizationStrategy', () => {

  let strategy: OverlayVisualizationStrategy;
  let keyBinding: KeyBinding;

  jest.spyOn(keycode, 'symbolizeKeycode').mockImplementation(x => x);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        Overlay
      ],
    });


    TestBed.runInInjectionContext(() => {
      strategy = new OverlayVisualizationStrategy(
        TestBed.inject(Overlay)
      );
    })

    keyBinding = {
      key: 'a',
      action: () => {
        /*noop*/
      },
      strategy,
      element: document.createElement('button'),
    };
  });

  it('should instantiate', () => {
    expect(strategy).toBeTruthy();
  });

  describe('create', () => {

    it('should create', () => {
      strategy.create(keyBinding);
      expect(strategy.overlayRef).toBeDefined();
      expect(strategy.portal.isAttached).toBe(false);
      expect(strategy.overlayRef?.hasAttached()).toBe(false);
      expect(strategy.portal.injector?.get(KEY_BINDING_OVERLAY_DATA)).toBe(keyBinding);
    });

    it('should throw if element is missing', () => {
      keyBinding.element = undefined;
      expect(() => strategy.create(keyBinding)).toThrow();
    });

    it('should skip overlay create if already created', () => {
      const overlay = TestBed.inject(Overlay);
      const spy = jest.spyOn(overlay, 'create');

      strategy.create(keyBinding);
      strategy.create(keyBinding);

      expect(spy).toHaveBeenCalledTimes(1);
    });

  });

  it('should destroy', () => {
    strategy.create(keyBinding);
    strategy.destroy();
    expect(strategy.overlayRef).toBeUndefined();
    expect(strategy.portal.isAttached).toBe(false);
  });

  describe('show', () => {

    it('should show', () => {
      strategy.create(keyBinding);
      strategy.show();

      expect(strategy.portal.isAttached).toBe(true);
      expect(strategy.overlayRef?.hasAttached()).toBe(true);
    });

    it('should skip if already attached', () => {
      const spy = jest.spyOn(strategy.portal, 'attach');

      strategy.create(keyBinding);
      strategy.show();
      strategy.show();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should skip if not created yet', () => {
      expect(strategy.overlayRef).toBeUndefined();

      const spy = jest.spyOn(strategy.portal, 'attach');
      strategy.show();
      expect(spy).not.toHaveBeenCalled();
    });

  });

  it('should hide', () => {
    strategy.create(keyBinding);
    strategy.show();
    strategy.hide();

    expect(strategy.portal.isAttached).toBe(false);
  });

});
