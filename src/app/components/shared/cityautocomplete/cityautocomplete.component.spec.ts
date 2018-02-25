import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityautocompleteComponent } from './cityautocomplete.component';

describe('CityautocompleteComponent', () => {
  let component: CityautocompleteComponent;
  let fixture: ComponentFixture<CityautocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityautocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityautocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
