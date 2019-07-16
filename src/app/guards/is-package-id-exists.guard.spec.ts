import { TestBed, async, inject } from '@angular/core/testing';

import { IsPackageIdExistsGuard } from './is-package-id-exists.guard';

describe('IsPackageIdExistsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsPackageIdExistsGuard]
    });
  });

  it('should ...', inject([IsPackageIdExistsGuard], (guard: IsPackageIdExistsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
