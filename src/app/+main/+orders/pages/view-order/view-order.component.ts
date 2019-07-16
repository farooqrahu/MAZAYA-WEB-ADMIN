import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../../../services/api/orders/orders.service';
import { assignAttributes } from '../../../../utils/json';
import { AuthService } from 'ng2-ui-auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { grayScaleMapStyles } from '../../../../shared/config/grayScaleMapStyles';
import { MapTypeStyle } from '@agm/core';
import { GeocodingService } from 'app/services/geocoding/geocoding.service';
import * as moment from 'moment';
import { find } from 'lodash';

enum ServiceStatus {
	Open,
	Processed,
	Cancelled,
	Completed,
	DriverOnTheWay = 'Driver on the Way',
	ArrivedAtCustomer = 'Arrived at Customer,',
}

@Component({
	           selector: 'mazaya-view-order',
	           templateUrl: './view-order.component.html',
	           styleUrls: [ './view-order.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ OrdersService, GeocodingService ]
           })
export class ViewOrderComponent implements OnInit {

	order: any;

	public serviceStatusEnum = ServiceStatus;
	/**
	 * Import map styles to display Google Maps in GrayScale
	 * @type {MapTypeStyle[]}
	 */
	mapStyles: MapTypeStyle[] = grayScaleMapStyles;

	orderId: string;

	activeMember: any = {};

	isBookLessThanADay = false;

	showMap = false;

	services: any;

	operator: any;

	driver: any;

	booker: any = null;
	showBooker: Boolean = true;

	constructor (private activatedRoute: ActivatedRoute, private router: Router, private ordersService: OrdersService,
	             private geoCoding: GeocodingService,
	             private modalService: NgbModal,
	             private auth: AuthService, private http: HttpClient) { }

	ngOnInit () {
		this.activatedRoute.params.subscribe((params) => {
			if ( params && params[ 'orderId' ] ) {
				this.orderId = params[ 'orderId' ];
//				this.getCustomer();
				this.loadOrder();
			}
		});
	}

	loadOrder () {
		if ( !this.orderId ) {
			return;
		}

		this.ordersService.viewOrderWithDetails(+this.orderId).subscribe((result: any) => {
			this.order = result.data;
			this.order = assignAttributes(this.order, result.included);
			this.services = result.data.attributes.services;
//			this.setActiveMember( this.booker['user-id'] );
			this.showOperator(0);
		});
	}

	getCustomer () {
		const customerId = this.auth.getPayload()[ 'customer-id' ];
		this.http.get(`${environment.baseUrl}/customers/${customerId}`).subscribe((res: any) => {
			this.booker = res.data.attributes;
		});
	}

	getOperatorAvatar (operator: any): string {
		if ( operator ) {
			if ( !operator[ 'image-url' ] ) {
				const letter1 = operator[ 'first-name' ].charAt(0);
				const letter2 = operator[ 'last-name' ].charAt(0);
				return `http://placehold.it/100x100?text=${letter1}${letter2}`;
			} else {
				return operator[ 'image-url' ];
			}

		} else {
			return `http://placehold.it/100x100?text=${'Assign'}`;
		}
	}

	getOperatorName (operator: any): string {
		if ( operator ) {
			return operator[ 'full-name' ];
		} else {
			return 'Waiting for assignment';
		}
	}

	getOperatorPhoneNumber (operator: any): string {
		if ( operator ) {
			return operator[ 'phone-number' ];
		}
	}

	getOrderDateFormatted (date: string): string {
		return moment(date).add(moment().utcOffset(),'m').format('MMMM DD, YYYY [at] HH:mm');
	}

	getPackageName () {
		const packages = this.order.attributes[ 'order-packages' ];
		if ( packages.length > 1 ) {
			return `${this.order.attributes[ 'order-packages' ][ 0 ][ 'package' ].name} (and ${packages.length - 1} more)`;
		} else {
			return this.order.attributes[ 'order-packages' ][ 0 ][ 'package' ].name;
		}
	}

	getSubtotal (): number {
		return this.order.attributes.net;
	}

	getCouponValue (): number {
		return 0;
	}

	getVAT (): number {
		return this.order.attributes['vat-amount'];
	}

	getTotal (): number {
		return this.order.attributes.total;
	}

	get members (): any[] {
		return this.order.attributes.members;
	}

	setActiveMember (index: any) {
		if ( this.booker && index === this.booker[ 'user-id' ] ) {
			this.showBooker = true;
			this.activeMember = this.booker;
			this.activeMember[ 'is-booker' ] = true;
			if ( this.activeMember && this.activeMember[ 'passport-expiry-date' ] ) {
				this.activeMember[ 'passport-expiry-date' ] = moment(this.activeMember[ 'passport-expiry-date' ]).format('LL');
			}
		} else {
			this.showBooker = false;
			this.activeMember = this.members[ index ];
			if ( this.activeMember && this.activeMember[ 'passport-expiry' ] ) {
				this.activeMember[ 'passport-expiry-date' ] = moment(this.activeMember[ 'passport-expiry' ]).format('LL');
			}
		}


	}

	getCurrentOrderStatus (): any {
		return this.order.attributes[ 'order-status' ];
	}

	getCurrentOrderStatusDescription (): string {
		return this.getCurrentOrderStatus()[ 0 ].description;
	}

	getOrderedBy (): string {
		const createdByRole = (<string>this.order.attributes[ 'created-by-role' ]).toLowerCase();
		if ( createdByRole === 'consumer' || createdByRole === 'guest' ) {
			return 'Consumer';
		} else {
			return `${this.order.attributes[ 'customer-first-name' ]} ${this.order.attributes[ 'customer-last-name' ]}`;
		}
	}

	isOrderCancelled (): boolean {
		const status = this.getCurrentOrderStatus();
		return status.code === 'cancelled';
	}

	showCancelButton (): boolean {
		const status = this.getCurrentOrderStatus();
		return status.code !== ('processing' || 'cancelled');
	}

	isOrderStatusCompleted (sequence: number): boolean {
		const status = this.getCurrentOrderStatus();
		return status.sequence >= sequence;
	}

	isCurrentOrderStatus (sequence: number): boolean {
		const status = this.getCurrentOrderStatus();
		return status.sequence === sequence;
	}


	cancelOrder (dismiss) {
		const orderId = this.order.id;
		const relationshipCancelled = {
			data: {
				type: 'order-status',
				id: 3
			}
		};
		this.http.patch(`${environment.baseUrl}/orders/${orderId}/relationships/order-status`,
		                relationshipCancelled).subscribe((result: any) => {
			this.loadOrder();
		}, (error) => {

		});

		dismiss();
	}

	cancelService (serviceId) {
		const relationshipCancelled = {
			data: {
				type: 'service-status',
				id: 8
			}
		};

		this.http.patch(`${environment.baseUrl}/service-orders/${serviceId}/relationships/service-status`,
		                relationshipCancelled).subscribe((result: any) => {
			this.loadOrder();
		}, (error) => {

		});
	}

	displayMap (service) {
		this.driver = null;
		if ( !this.showMap ) {
			this.driver = service[ 'driver' ];
		}

		this.showMap = !this.showMap;
	}

	async showOperator (index) {
		this.driver = null;
		this.showMap = false;

		let operatorId, driverId;

		if ( this.order.attributes[ 'order-service' ] ) {
			if ( Array.isArray(this.order.attributes[ 'order-service' ]) ) {
				operatorId = find(this.order.attributes[ 'order-service' ], (service: any) => {
					return service.attributes[ 'operator-id' ] !== null;
				});
				if ( operatorId ) {
					operatorId = operatorId.attributes[ 'operator-id' ];
				}
				driverId = find(this.order.attributes[ 'order-service' ], (service: any) => {
					return service.attributes[ 'driver-id' ] !== null;
				});
				if ( driverId ) {
					driverId = driverId.attributes[ 'driver-id' ];
				}
			} else {
				operatorId = this.order.attributes[ 'order-service' ].attributes[ 'operator-id' ];
				driverId = this.order.attributes[ 'order-service' ].attributes[ 'driver-id' ];
			}
		}

		if ( driverId ) {
			this.driver = await this.loadDriver(driverId);
		} else {
			this.driver = null;
		}
		if ( operatorId ) {
			this.operator = await this.loadOperator(operatorId);
		} else {
			this.operator = null;
		}
	}

	loadOperator (id: string) {
		return new Promise((resolve) => {
			this.http.get(`${environment.baseUrl}/users/${id}`).subscribe((result: any) => {
				resolve(result.data.attributes);
			});
		});
	}

	loadDriver (id: string) {
		return new Promise((resolve) => {
			this.http.get(`${environment.baseUrl}/users/${id}`).subscribe((result: any) => {
				resolve(result.data.attributes);
			});
		});
	}

	verifyBookingDate (modalContent) {
		const bookingdate = moment(this.order.attributes[ 'booked-date-utc' ]);
		const today = moment();
		const diff = bookingdate.diff(today, 'hours');

		if ( diff < 24 ) {
			this.isBookLessThanADay = true;
		}

		this.modalService.open(modalContent, { centered: true });
	}
}
