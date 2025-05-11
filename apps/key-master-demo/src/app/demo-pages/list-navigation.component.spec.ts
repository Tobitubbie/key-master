import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListNavigationComponent } from './list-navigation.component';

describe('ListNavigationComponent', () => {
  let component: ListNavigationComponent;
  let fixture: ComponentFixture<ListNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListNavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
