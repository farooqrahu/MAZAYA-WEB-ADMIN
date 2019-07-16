import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCapacityModalComponent } from './delete-capacity-modal.component';

describe('DeleteCapacityModalComponent', () => {
  let component: DeleteCapacityModalComponent;
  let fixture: ComponentFixture<DeleteCapacityModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCapacityModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCapacityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
