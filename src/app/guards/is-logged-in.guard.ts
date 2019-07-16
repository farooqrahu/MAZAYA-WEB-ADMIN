import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';

@Injectable()
export class IsLoggedInGuard implements CanActivate {

	constructor (private authService: AuthService, private router: Router) {}

	canActivate (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if ( this.authService.isAuthenticated() ) {
			return true;
		} else {
			//noinspection JSIgnoredPromiseFromCall
			this.router.navigateByUrl('/auth/login');
		}
	}
}
