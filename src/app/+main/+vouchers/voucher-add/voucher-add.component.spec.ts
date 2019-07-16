import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherAddComponent } from './voucher-add.component';

describe('VoucherAddComponent', () => {
  let component: VoucherAddComponent;
  let fixture: ComponentFixture<VoucherAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
