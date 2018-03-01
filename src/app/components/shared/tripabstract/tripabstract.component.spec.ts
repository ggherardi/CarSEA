import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripabstractComponent } from './tripabstract.component';

describe('TripabstractComponent', () => {
  let component: TripabstractComponent;
  let fixture: ComponentFixture<TripabstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripabstractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripabstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
