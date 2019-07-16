import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitiesAddComponent } from './capacities-add.component';

describe('CapacitiesAddComponent', () => {
  let component: CapacitiesAddComponent;
  let fixture: ComponentFixture<CapacitiesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacitiesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacitiesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
