import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreAccountModalComponent } from './restore-account-modal.component';

describe('RestoreAccountModalComponent', () => {
  let component: RestoreAccountModalComponent;
  let fixture: ComponentFixture<RestoreAccountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoreAccountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
