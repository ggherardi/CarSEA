import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathchooserComponent } from './pathchooser.component';

describe('PathchooserComponent', () => {
  let component: PathchooserComponent;
  let fixture: ComponentFixture<PathchooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathchooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathchooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
