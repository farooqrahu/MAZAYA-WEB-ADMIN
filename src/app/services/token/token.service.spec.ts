import { TestBed, inject } from '@angular/core/testing';

import { TokenService } from './token.service';
import { Ng2UiAuthModule } from 'ng2-ui-auth';
import { authOptions } from '../../shared/config/authOptions';

describe('Service: Token', () => {
	beforeEach(() => {
		TestBed.configureTestingModule(
			{
				providers: [ TokenService ],
				imports: [ Ng2UiAuthModule.forRoot(authOptions) ]
			});
	});

	it('should create an instance of TokenService', inject(
		[ TokenService ], (service: TokenService) => {
			expect(service).toBeTruthy();
		}));
});
