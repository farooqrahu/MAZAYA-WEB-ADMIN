import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { PaymentOption } from '../../../../interfaces/PaymentOption';
import {
	AdminPaymentOptions, CallCenterPaymentOptions, OperatorPaymentOptions, SupervisorPaymentOptions
} from '../../../../utils/PaymentOptions';

@Component({
	           selector: 'mazaya-finalize-payment',
	           templateUrl: './finalize-payment.component.html',
	           styleUrls: [ './finalize-payment.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated
           })
export class FinalizePaymentComponent implements OnInit {

	paymentOption: PaymentOption = null;

	availablePaymentOptions: PaymentOption[] = [];

	constructor (private auth: AuthService) {

	}

	optionTrack (index: number, option: PaymentOption) {
		return option.id;
	}

	ngOnInit () {
		const userRole = (<string>this.auth.getPayload()[ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' ]).toLowerCase();
		if ( userRole === 'admin' ) {
			this.availablePaymentOptions = AdminPaymentOptions;
		} else if ( userRole === 'supervisor' ) {
			this.availablePaymentOptions = SupervisorPaymentOptions;
		} else if ( userRole === 'operator' ) {
			this.availablePaymentOptions = OperatorPaymentOptions;
		} else if ( userRole === 'call center' ) {
			this.availablePaymentOptions = CallCenterPaymentOptions;
		} else {
			this.availablePaymentOptions = [];
		}
	}

}
