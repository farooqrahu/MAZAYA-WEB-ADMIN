import { TestBed, async, inject } from '@angular/core/testing';

import { IsOperatorGuard } from './is-operator.guard';

describe('Guard: IsOperator', () => {
	beforeEach(() => {
		TestBed.configureTestingModule(
			{
				providers: [ IsOperatorGuard ]
			});
	});

	it('should create an instance of IsOperatorGuard', inject(
		[ IsOperatorGuard ], (guard: IsOperatorGuard) => {
			expect(guard).toBeTruthy();
		}));
});
