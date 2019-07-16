import { TestBed, inject } from '@angular/core/testing';

import { JWTInterceptorService } from './jwt-interceptor.service';
import { Ng2UiAuthModule } from 'ng2-ui-auth';
import { authOptions } from '../../shared/config/authOptions';

describe('Service: JWTInterceptor', () => {
	beforeEach(() => {
		TestBed.configureTestingModule(
			{
				providers: [ JWTInterceptorService ],
				imports: [ Ng2UiAuthModule.forRoot(authOptions) ]
			});
	});

	it('should create an instance of JWTInterceptorService', inject(
		[ JWTInterceptorService ], (service: JWTInterceptorService) => {
			expect(service).toBeTruthy();
		}));
});
