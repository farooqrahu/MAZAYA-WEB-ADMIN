import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectAccountModalComponent } from './reject-account-modal.component';

describe('ActivateAccountModalComponent', () => {
  let component: RejectAccountModalComponent;
  let fixture: ComponentFixture<RejectAccountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectAccountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
