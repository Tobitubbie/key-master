import {ComponentFixture, TestBed} from "@angular/core/testing";
import {provideNoopAnimations} from "@angular/platform-browser/animations";
import {KeyBinding} from "../../models";
import {KEY_BINDING_OVERLAY_DATA, KeyBindingOverlayComponent} from "./key-binding-overlay.component";
import {SymbolizeKeyPipe} from '../../keycode/symbolizeKey.pipe';
import {Pipe, PipeTransform} from "@angular/core";


@Pipe({
  name: 'symbolizeKey',
  standalone: true,
})
class SymbolizeKeyPipeMock implements PipeTransform {
  transform = (value: string, ..._args: unknown[]) => value;
}

describe('KeyBindingOverlayComponent', () => {

  let fixture: ComponentFixture<KeyBindingOverlayComponent>;
  let component: KeyBindingOverlayComponent;

  const keyBinding: KeyBinding = {
    key: 'a',
    action: () => {
      /*noop*/
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        {
          provide: KEY_BINDING_OVERLAY_DATA,
          useValue: keyBinding,
        }
      ],
      imports: [
        KeyBindingOverlayComponent,
      ],
    }).overrideComponent(KeyBindingOverlayComponent, {
      remove: {imports: [SymbolizeKeyPipe]},
      add: {imports: [SymbolizeKeyPipeMock]},
    }).compileComponents();

    fixture = TestBed.createComponent(KeyBindingOverlayComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should get key binding injected', () => {
    const element = fixture.nativeElement.querySelector('p');
    expect(component.keyBinding).toBe(keyBinding);
    expect(element.textContent?.includes(keyBinding.key)).toBe(true);
  });

});
