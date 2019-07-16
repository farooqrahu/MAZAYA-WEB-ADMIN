import { TestBed, async, inject } from '@angular/core/testing';

import { IsAdminGuard } from './is-admin.guard';

describe('Guard: IsAdmin', () => {
	beforeEach(() => {
		TestBed.configureTestingModule(
			{
				providers: [ IsAdminGuard ]
			});
	});

	it('should create an instance of IsAdminGuard', inject(
		[ IsAdminGuard ], (guard: IsAdminGuard) => {
			expect(guard).toBeTruthy();
		}));
});
