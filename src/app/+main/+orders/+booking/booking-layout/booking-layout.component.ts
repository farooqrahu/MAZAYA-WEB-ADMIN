import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { CheckoutService } from '../../../../services/checkout/checkout.service';

@Component({
	           selector: 'mazaya-booking-layout',
	           templateUrl: './booking-layout.component.html',
	           styleUrls: [ './booking-layout.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           changeDetection: ChangeDetectionStrategy.OnPush
           })
export class BookingLayoutComponent implements OnInit {

	@ViewChild(MatHorizontalStepper, {static: false}) stepper: MatHorizontalStepper;

	constructor (private checkoutService: CheckoutService, private router: Router) { }

	public stepRoutes: any[] = [
		{ step: 1, route: 'select-flights' },
		{ step: 2, route: 'select-order-type' },
		{ step: 3, route: 'select-services' },
		{ step: 4, route: 'select-members' },
		{ step: 5, route: 'select-pickup-location' },
		{ step: 6, route: 'finalize-payment' }
	];

	ngOnInit () {
	}

	orderRequiresPickup () {
		return this.checkoutService.orderRequiresPickup();
	}

	isLastStep () {
		return (this.stepper.selectedIndex === 4 && !this.orderRequiresPickup()) ||
			(this.stepper.selectedIndex === 5 && this.orderRequiresPickup());
	}

	isFlightSelected (): boolean {
		return this.checkoutService.hasFlightSelected();
	}

	isOrderTypeSelected (): boolean {
		return this.checkoutService.hasBookingTypeSelected();
	}

	isServicesSelected (): boolean {
		return this.checkoutService.hasSelectedInitialService();
	}

	isMembersSelected (): boolean {
		return this.checkoutService.hasMembersSelected();
	}

	isPickupLocationSelected (): boolean {
		return this.checkoutService.hasSelectedPickupLocation();
	}

	isPaymentSelected (): boolean {
		return true;
	}

	async canProceed (): Promise<any> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(this.stepper && this.stepper.selected && this.stepper.selected.completed);
			});
		});
	}

	routeToStep (stepIndex: number) {
		this.router.navigateByUrl(`/app/orders/booking/${this.getNextStepRoute()}`);
		this.checkoutService.updateProgress(stepIndex);
	}

	getNextStepRoute () {
		return this.stepRoutes.filter(
			(step: { step: number, route: string }) => step.step === this.checkoutService.progress + 1)[ 0 ].route;
	}

	getPreviousStepRoute () {
		return this.stepRoutes.filter(
			(step: { step: number, route: string }) => step.step === this.checkoutService.progress - 1)[ 0 ].route;
	}

	completeOrder () {

	}

}
