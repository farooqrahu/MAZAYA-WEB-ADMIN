import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CheckoutService } from '../services/checkout/checkout.service';

@Injectable()
export class PickUpLocationRequiredGuard implements CanActivate {
	/**
	 * Constructor
	 * @param router
	 * @param {CheckoutService} checkoutService
	 */
	constructor (private router: Router, private checkoutService: CheckoutService) {}

	/**
	 * Check if the current order requires the user to select a pick-up location
	 * @param {ActivatedRouteSnapshot} next
	 * @param {RouterStateSnapshot} state
	 * @returns {Observable<boolean> | Promise<boolean> | boolean}
	 */
	canActivate (next: ActivatedRouteSnapshot,
	             state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if ( this.checkoutService.orderRequiresPickup() ) {
			return true;
		} else {
			this.router.navigateByUrl(`app/orders/booking/finalize-payment`);
			return false;
		}
	}
}
