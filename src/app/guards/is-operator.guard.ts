import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class IsOperatorGuard implements CanActivate {
	canActivate (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return true;
	}
}
