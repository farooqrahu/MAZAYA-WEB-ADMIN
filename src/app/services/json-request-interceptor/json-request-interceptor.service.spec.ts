import { TestBed, inject } from '@angular/core/testing';

import { JSONRequestInterceptorService } from './json-request-interceptor.service';

describe('JsonRequestInterceptorService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule(
			{
				providers: [ JSONRequestInterceptorService ]
			});
	});

	it('should be created', inject([ JSONRequestInterceptorService ], (service: JSONRequestInterceptorService) => {
		expect(service).toBeTruthy();
	}));
});
