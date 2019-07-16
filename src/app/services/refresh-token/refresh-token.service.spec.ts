import { TestBed, inject } from '@angular/core/testing';

import { RefreshTokenService } from './refresh-token.service';
import { Ng2UiAuthModule } from 'ng2-ui-auth';
import { authOptions } from '../../shared/config/authOptions';

describe('Service: RefreshToken', () => {
	beforeEach(() => {
		TestBed.configureTestingModule(
			{
				providers: [ RefreshTokenService ],
				imports: [ Ng2UiAuthModule.forRoot(authOptions) ]
			});
	});

	it('should create an instance of RefreshTokenService', inject(
		[ RefreshTokenService ], (service: RefreshTokenService) => {
			expect(service).toBeTruthy();
		}));
});
