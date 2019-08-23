import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectAgreementModalComponent } from './reject-agreement-modal.component';

describe('ActivateAccountModalComponent', () => {
  let component: RejectAgreementModalComponent;
  let fixture: ComponentFixture<RejectAgreementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectAgreementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectAgreementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
