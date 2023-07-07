import {ComponentFixture, TestBed} from "@angular/core/testing";
import {OverlayComponent} from "./overlay.component";
import {VisualizationService} from "../visualization.service";
import {provideNoopAnimations} from "@angular/platform-browser/animations";
import {KeyBinding} from "../../models";

describe('OverlayComponent', () => {

  let service: VisualizationService;
  let fixture: ComponentFixture<OverlayComponent>;
  let component: OverlayComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        {
          provide: VisualizationService,
          useValue: {
            isOpen: jest.fn(() => true),
            activeKeyBindings: jest.fn(),
          }
        }
      ],
      imports: [
        OverlayComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayComponent);
    service = TestBed.inject(VisualizationService);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('isEmpty', () => {

    it('should return true if map is empty', () => {
      const map: Map<string, KeyBinding[]> = new Map();
      expect(component.isEmpty(map)).toBe(true);
    });

    it('should return true if no key bindings in map', () => {
      const map: Map<string, KeyBinding[]> = new Map([
        ['containerA', []],
        ['containerB', []],
      ]);
      expect(component.isEmpty(map)).toBe(true);
    });

    it('should return false if map has some key binding', () => {
      const map: Map<string, KeyBinding[]> = new Map([
        ['containerA', []],
        ['containerB', [{
          key: 'a', action: () => {/*noop*/
          }
        }]],
      ]);
      expect(component.isEmpty(map)).toBe(false);
    });

    it('should display empty-message if no key bindings in map', async () => {
      jest.spyOn(service, 'activeKeyBindings').mockReturnValue(new Map());

      fixture.detectChanges();
      const emptyContainer = fixture.nativeElement.querySelector('[data-test="empty-message"]');

      expect(emptyContainer).toBeDefined();
    });

  });

  it('should keep order of groups', () => {
    const map: Map<string, KeyBinding[]> = new Map([
      ['containerB', [{
        key: 'b',
        label: 'first',
        action: () => {
          /*noop*/
        }
      }]],
      ['containerA', [{
        key: 'a',
        label: 'second',
        action: () => {
          /*noop*/
        }
      }]],
    ]);
    jest.spyOn(service, 'activeKeyBindings').mockReturnValue(map);

    fixture.detectChanges();
    const groupNames: HTMLElement[] = fixture.nativeElement.querySelectorAll('[data-test="group-name"]');

    expect(groupNames[0].textContent?.includes('containerB')).toBe(true);
    expect(groupNames[1].textContent?.includes('containerA')).toBe(true);
  });

});
