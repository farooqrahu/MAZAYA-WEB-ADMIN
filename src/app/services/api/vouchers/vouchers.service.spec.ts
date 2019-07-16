import { TestBed, inject } from '@angular/core/testing';

import { VouchersService } from './vouchers.service';

describe('VouchersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VouchersService]
    });
  });

  it('should be created', inject([VouchersService], (service: VouchersService) => {
    expect(service).toBeTruthy();
  }));
});
