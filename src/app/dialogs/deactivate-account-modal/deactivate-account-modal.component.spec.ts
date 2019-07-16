import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateAccountModalComponent } from './deactivate-account-modal.component';

describe('DeactivateAccountModalComponent', () => {
  let component: DeactivateAccountModalComponent;
  let fixture: ComponentFixture<DeactivateAccountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivateAccountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
