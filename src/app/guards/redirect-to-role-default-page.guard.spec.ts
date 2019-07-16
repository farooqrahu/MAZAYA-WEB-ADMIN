import { TestBed, async, inject } from '@angular/core/testing';

import { RedirectToRoleDefaultPageGuard } from './redirect-to-role-default-page.guard';

describe('RedirectToRoleDefaultPageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedirectToRoleDefaultPageGuard]
    });
  });

  it('should ...', inject([RedirectToRoleDefaultPageGuard], (guard: RedirectToRoleDefaultPageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
