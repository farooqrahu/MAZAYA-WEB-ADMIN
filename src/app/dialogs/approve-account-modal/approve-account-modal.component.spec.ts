import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveAccountModalComponent } from './activate-account-modal.component';

describe('ActivateAccountModalComponent', () => {
  let component: ApproveAccountModalComponent;
  let fixture: ComponentFixture<ApproveAccountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveAccountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
