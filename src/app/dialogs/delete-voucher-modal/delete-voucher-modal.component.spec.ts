import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVoucherModalComponent } from './delete-voucher-modal.component';

describe('DeleteVoucherModalComponent', () => {
  let component: DeleteVoucherModalComponent;
  let fixture: ComponentFixture<DeleteVoucherModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteVoucherModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteVoucherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
