import { TestBed, async, inject } from '@angular/core/testing';

import { IsUseridExistsGuard } from './is-userid-exists.guard';

describe('IsUseridExistsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsUseridExistsGuard]
    });
  });

  it('should ...', inject([IsUseridExistsGuard], (guard: IsUseridExistsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
