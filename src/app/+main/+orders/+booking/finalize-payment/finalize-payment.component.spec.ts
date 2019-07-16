import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizePaymentComponent } from './finalize-payment.component';

describe('FinalizePaymentComponent', () => {
  let component: FinalizePaymentComponent;
  let fixture: ComponentFixture<FinalizePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalizePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalizePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
