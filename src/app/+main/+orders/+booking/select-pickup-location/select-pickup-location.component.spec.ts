import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPickupLocationComponent } from './select-pickup-location.component';

describe('SelectPickupLocationComponent', () => {
  let component: SelectPickupLocationComponent;
  let fixture: ComponentFixture<SelectPickupLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPickupLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPickupLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
