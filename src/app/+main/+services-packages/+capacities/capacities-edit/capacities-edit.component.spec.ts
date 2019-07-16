import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitiesEditComponent } from './capacities-edit.component';

describe('CapacitiesEditComponent', () => {
  let component: CapacitiesEditComponent;
  let fixture: ComponentFixture<CapacitiesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacitiesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacitiesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
