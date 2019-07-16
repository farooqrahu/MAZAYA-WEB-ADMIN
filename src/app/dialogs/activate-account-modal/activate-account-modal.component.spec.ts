import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateAccountModalComponent } from './activate-account-modal.component';

describe('ActivateAccountModalComponent', () => {
  let component: ActivateAccountModalComponent;
  let fixture: ComponentFixture<ActivateAccountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateAccountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
