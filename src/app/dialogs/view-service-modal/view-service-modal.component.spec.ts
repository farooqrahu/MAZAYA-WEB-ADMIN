import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServiceModalComponent } from './view-service-modal.component';

describe('ViewServiceModalComponent', () => {
  let component: ViewServiceModalComponent;
  let fixture: ComponentFixture<ViewServiceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewServiceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewServiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
