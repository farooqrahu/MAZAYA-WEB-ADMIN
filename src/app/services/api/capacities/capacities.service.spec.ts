import { TestBed, inject } from '@angular/core/testing';

import { CapacitiesService } from './capacities.service';

describe('CapacitiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CapacitiesService]
    });
  });

  it('should be created', inject([CapacitiesService], (service: CapacitiesService) => {
    expect(service).toBeTruthy();
  }));
});
