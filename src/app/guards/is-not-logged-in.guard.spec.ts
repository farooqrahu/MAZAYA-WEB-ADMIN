import { TestBed, async, inject } from '@angular/core/testing';

import { IsNotLoggedInGuard } from './is-not-logged-in.guard';
import { Ng2UiAuthModule } from 'ng2-ui-auth';
import { RouterTestingModule } from '@angular/router/testing';
import { appRoutes } from '../app-routing.module';
import { PageNotFoundComponent } from '../app-components/page-not-found/page-not-found.component';
import { ChangeLanguageComponent } from '../app-components/change-language/change-language.component';

describe('Guard: IsNotLoggedIn', () => {
	beforeEach(() => {
		TestBed.configureTestingModule(
			{
				providers: [ IsNotLoggedInGuard ],
				imports: [ Ng2UiAuthModule.forRoot({}), RouterTestingModule.withRoutes(appRoutes) ],
				declarations: [ PageNotFoundComponent, ChangeLanguageComponent ]
			});
	});

	it('should create an instance of IsNotLoggedInGuard', inject(
		[ IsNotLoggedInGuard ], (guard: IsNotLoggedInGuard) => {
			expect(guard).toBeTruthy();
		}));

	it('should return true if user is not logged in', inject(
		[ IsNotLoggedInGuard ], (guard: IsNotLoggedInGuard) => {
			expect(guard.canActivate(null, null)).toBeTruthy();
		}));
});
