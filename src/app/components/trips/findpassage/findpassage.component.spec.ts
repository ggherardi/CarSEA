import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindpassageComponent } from './findpassage.component';

describe('FindpassageComponent', () => {
  let component: FindpassageComponent;
  let fixture: ComponentFixture<FindpassageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindpassageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindpassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
