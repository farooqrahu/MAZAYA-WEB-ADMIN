import { TestBed, async, inject } from '@angular/core/testing';

import { IsCorporateGuard } from './is-corporate.guard';

describe('Guard: IsCorporate', () => {
	beforeEach(() => {
		TestBed.configureTestingModule(
			{
				providers: [ IsCorporateGuard ]
			});
	});

	it('should create an instance of IsCorporateGuard', inject(
		[ IsCorporateGuard ], (guard: IsCorporateGuard) => {
			expect(guard).toBeTruthy();
		}));
});
