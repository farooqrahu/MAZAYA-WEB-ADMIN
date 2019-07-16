import { TestBed, async, inject } from '@angular/core/testing';

import { IsOrderExistsGuard } from './is-order-exists.guard';

describe('IsOrderExistsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsOrderExistsGuard]
    });
  });

  it('should ...', inject([IsOrderExistsGuard], (guard: IsOrderExistsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
