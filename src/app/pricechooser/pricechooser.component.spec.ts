import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricechooserComponent } from './pricechooser.component';

describe('PricechooserComponent', () => {
  let component: PricechooserComponent;
  let fixture: ComponentFixture<PricechooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricechooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricechooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
