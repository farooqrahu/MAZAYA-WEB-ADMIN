import { TestBed, async, inject } from '@angular/core/testing';

import { IsLoggedInGuard } from './is-logged-in.guard';
import { Ng2UiAuthModule } from 'ng2-ui-auth';
import { appRoutes } from '../app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeLanguageComponent } from '../app-components/change-language/change-language.component';
import { PageNotFoundComponent } from '../app-components/page-not-found/page-not-found.component';

describe('Guard: IsLoggedIn', () => {
	beforeEach(() => {
		TestBed.configureTestingModule(
			{
				providers: [ IsLoggedInGuard ],
				imports: [ Ng2UiAuthModule.forRoot({}), RouterTestingModule.withRoutes(appRoutes) ],
				declarations: [ PageNotFoundComponent, ChangeLanguageComponent ]
			});
	});

	it('should create an instance of IsLoggedInGuard', inject(
		[ IsLoggedInGuard ], (guard: IsLoggedInGuard) => {
			expect(guard).toBeTruthy();
		}));

	it('should return false is user is not logged in', inject(
		[ IsLoggedInGuard ], (guard: IsLoggedInGuard) => {
			expect(guard.canActivate(null, null)).toBeFalsy();
		}));
});
