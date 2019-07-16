import { PaymentOption } from '../interfaces/PaymentOption';

export const PaymentOptions: PaymentOption[] = [
	{ id: 1, code: 'CC', name: 'Credit Card' },
	{ id: 2, code: 'CA', name: 'Cash' },
	{ id: 3, code: 'SN', name: 'SPAN Network' },
	{ id: 4, code: 'PA', name: 'Pay On Arrival' }
];

export const AdminPaymentOptions: PaymentOption[] =[
	{ id: 2, code: 'CA', name: 'Cash' },
	{ id: 3, code: 'SN', name: 'SPAN Network' }
];
export const SupervisorPaymentOptions: PaymentOption[] =[
	{ id: 2, code: 'CA', name: 'Cash' },
	{ id: 3, code: 'SN', name: 'SPAN Network' }
];
export const OperatorPaymentOptions: PaymentOption[] =[
	{ id: 2, code: 'CA', name: 'Cash' },
	{ id: 3, code: 'SN', name: 'SPAN Network' }
];
export const CallCenterPaymentOptions: PaymentOption[] =[
	{ id: 4, code: 'PA', name: 'Pay On Arrival' }
];
