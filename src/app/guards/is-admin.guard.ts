import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class IsAdminGuard implements CanActivate {
	canActivate (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return true;
	}
}
