import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferedtripsComponent } from './offeredtrips.component';

describe('OfferedtripsComponent', () => {
  let component: OfferedtripsComponent;
  let fixture: ComponentFixture<OfferedtripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferedtripsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedtripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
