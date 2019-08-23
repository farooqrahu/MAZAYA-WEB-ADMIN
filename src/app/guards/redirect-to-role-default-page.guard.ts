import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RedirectToRoleDefaultPageGuard implements CanActivate {

	constructor (private auth: AuthService, private router: Router) {}

	canActivate (
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		const role: string = (<string>this.auth.getPayload()[ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' ]).toLowerCase();
		if ( role === 'admin' ) {
			// TODO change this to dashboard once it's done
			this.router.navigateByUrl('app/dashboard');
			return false;
		} else if ( role === 'supervisor' ) {
			this.router.navigateByUrl('app/orders/open');
			return false;
		} else if ( role === 'operator' ) {
			this.router.navigateByUrl('app/orders/assigned');
			return false;
		} else if ( role.includes('call') ) {
			this.router.navigateByUrl('app/account/profile');
			return false;
		} else if ( role === 'reseller' ) {
			// TODO change this to "My Agreements" once done
			this.router.navigateByUrl('app/account/profile');
			return false;
		} else if ( role === 'corporate' ) {
			// TODO change this to "My Agreements" once done
			this.router.navigateByUrl('app/account/profile');
			return false;
		} else if ( role === 'driver' ) {
			this.router.navigateByUrl('app/account/profile');
			return false;
		} else {
			this.router.navigateByUrl('app/account/profile');
			return false;
		}
	}
}
