import { TestBed, async, inject } from '@angular/core/testing';

import { PickUpLocationRequiredGuard } from './pick-up-location-required.guard';

describe('PickUpLocationRequiredGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PickUpLocationRequiredGuard]
    });
  });

  it('should ...', inject([PickUpLocationRequiredGuard], (guard: PickUpLocationRequiredGuard) => {
    expect(guard).toBeTruthy();
  }));
});
