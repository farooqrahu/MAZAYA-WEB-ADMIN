import { TestBed, async, inject } from '@angular/core/testing';

import { IsResellerGuard } from './is-reseller.guard';

describe('Guard: IsReseller', () => {
	beforeEach(() => {
		TestBed.configureTestingModule(
			{
				providers: [ IsResellerGuard ]
			});
	});

	it('should create an instance of IsResellerGuard', inject(
		[ IsResellerGuard ], (guard: IsResellerGuard) => {
			expect(guard).toBeTruthy();
		}));
});
