import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiAutocompleteComponent } from './apiautocomplete.component';

describe('CityautocompleteComponent', () => {
  let component: ApiAutocompleteComponent;
  let fixture: ComponentFixture<ApiAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
