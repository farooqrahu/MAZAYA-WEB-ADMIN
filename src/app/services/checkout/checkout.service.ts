import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { LocalStorage, LocalStorageService } from 'ngx-store';
import { environment } from '../../../environments/environment';
import { find } from 'lodash';
import * as moment from 'moment';
import { GMapsAddress, GMapsCoordinates } from '../../interfaces/g-maps-coordinates';
import { GeocodingService } from '../geocoding/geocoding.service';

@Injectable()
export class CheckoutService implements OnDestroy {

	/**
	 * Local Storage Flag for whether or not a booking is currently in progress
	 * @type {boolean}
	 */
	@LocalStorage('o_progress_bool') private orderInProgress = false;

	/**
	 * Locale Storage number indicating the current step in the booking process
	 * @type {number}
	 */
	@LocalStorage('o_progress_step') private currentStep = 1;

	/**
	 * Local Storage string indicating the route of the current step
	 * @type {string}
	 */
	@LocalStorage('o_progress_route') private currentStepRoute = 'flights';

	/**
	 * Local Storage version of the selected initial service
	 * @type {any}
	 */
	@LocalStorage('o_init_srvc') private selectedInitialServices: any[] = [];

	/**
	 * Local Storage version of the selected flight
	 * @type {any}
	 */
	@LocalStorage('o_fl') private selectedFlight: any = null;

	/**
	 * Local Storage version of the selected booking tupe
	 * @type {any}
	 */
	@LocalStorage('o_booking_type') private selectedBookingType: any = null;

	/**
	 * Local Storage version of the selected members
	 * @type {any}
	 */
	@LocalStorage('o_ms') private selectedMembers: any[] = [];

	/**
	 * Local Storage version of the selected additional services
	 * @type {any}
	 */
	@LocalStorage('o_add_srvc') private selectedAdditionalServices: any[] = [];

	/**
	 * Local Storage version of the selected pick up location (if required)
	 * @type {any}
	 */
	@LocalStorage('o_pu_loc') private selectedPickupLocation: string | GMapsAddress | GMapsCoordinates = null;

	@LocalStorage(
		'o_fl_s_q') private flightSearchQuery: { departure: string, destination: string, flightDate: any, flightNumber: string };

	@LocalStorage('o_t_t') private travelType: 'arrival' | 'departure' = 'departure';

	@LocalStorage('o_mt') private membershipName: any = null;
	@LocalStorage('o_mstat') private membershipStatus: any = null;


	@LocalStorage('o_am_count') private approvedMembersCount: any = 0;
	@LocalStorage('o_wp_success') private orderWithoutPaymentSuccess: any = null;

	membersChanged: EventEmitter<any> = new EventEmitter<any>();
	progressChanged: EventEmitter<number> = new EventEmitter<number>();

	/**
	 * Percentage of VAT
	 * @type {number}
	 */
	vatPercent = 5;

	/**
	 * Constructor
	 */
	constructor (private auth: AuthService, private http: HttpClient,
	             private geoLocationService: GeocodingService,
	             private localStorageService: LocalStorageService) {}

	ngOnDestroy () {}

	/**
	 * Start a booking process
	 */
	startProgress (): Promise<boolean> {
		return new Promise((resolve) => {
			this.orderInProgress = true;
			this.currentStep = 1;
			this.progressChanged.emit(this.currentStep);
			resolve(true);
		});
	}

	/**
	 * Reset booking progress
	 */
	resetProgress (): void {
		this.orderInProgress = false;
		this.currentStep = 1;
		this.progressChanged.emit(this.currentStep);
		this.currentStepRoute = 'flights';
		this.selectedInitialServices = [];
		this.selectedFlight = null;
		this.selectedMembers = [];
		this.selectedAdditionalServices = [];
		this.selectedPickupLocation = null;
		this.flightSearchQuery = null;
		this.travelType = 'departure';
		this.selectedBookingType = null;
	}

	/**
	 * Get a flag indicating whether or not a booking is currently in progress
	 * @returns {boolean}
	 */
	get isInProgress (): boolean {
		return this.orderInProgress;
	}

	/**
	 * Get the current progress of the booking
	 * @returns {number}
	 */
	get progress (): number {
		return this.currentStep;
	}

	/**
	 * Set the current progress of the booking
	 * @param {number} step
	 */
	set progress (step: number) {
		this.currentStep = step;
		this.progressChanged.emit(this.currentStep);
	}

	/**
	 * Get the route to the current booking step
	 * @returns {string}
	 */
	get progressRoute (): string {
		return this.currentStepRoute;
	}

	/**
	 * Set the route to the current booking step
	 * @param {string} route
	 */
	set progressRoute (route: string) {
		this.currentStepRoute = route;
	}

	public updateProgress (step: number): void {
		switch ( step ) {
			case 1:
				this.selectedFlight = null;
				break;
			case 2:
				this.selectedBookingType = null;
				break;
			case 3:
				this.selectedInitialServices = [];
				break;
			case 4:
				this.removeMembers();
				break;
			case 5:
				this.selectedPickupLocation = null;
				break;
			default:
				break;
		}
	}

	/**
	 * Select the initial service
	 * @param services
	 */
	selectServices (services: any[]): void {
		this.selectedInitialServices = [];
		this.selectedInitialServices = services;
	}

	selectBookingType (bookingType: any[]): void {
		this.selectedBookingType = bookingType;
	}

	hasBookingTypeSelected (): boolean {
		return this.selectedBookingType !== null;
	}

	/**
	 * Get the selected initial service (if any)
	 * @returns {any}
	 */
	get initialServices (): any {
		return this.selectedInitialServices;
	}

	/**
	 * Select the flight
	 * @param flight
	 */
	selectFlight (flight: any): void {
		this.selectedFlight = flight;
	}

	/**
	 * Get the selected flight (if any)
	 * @returns {any}
	 */
	get flight (): any {
		return this.selectedFlight;
	}

	hasFlightSelected (): boolean {
		return this.selectedFlight !== null;
	}

	/**
	 * Add a member
	 * @param member
	 * @param replace
	 */
	addMember (member: any, replace: boolean = false): void {
		if ( replace ) {
			if ( Array.isArray(member) ) {
				this.selectedMembers = member;
			} else {
				this.selectedMembers = [ member ];
			}
		} else {
			if ( !this.selectedMembers ) {
				this.selectedMembers = [ member ];
			} else {
				this.selectedMembers.push(member);
			}
		}
		this.membersChanged.emit(this.selectedMembers);
	}

	/**
	 * Get all members
	 * @returns {any[]}
	 */
	get members (): any[] {
		return this.selectedMembers;
	}

	hasMembersSelected(): boolean{
		return this.selectedMembers.length > 0;
	}

	removeMembers () {
		this.selectedMembers = [];
	}

	/**
	 * Remove a member either by object or index
	 * @param member
	 * @param {number} index
	 * @returns {boolean}
	 */
	removeMember (member?: any, index?: number): boolean {
		if ( !member && !index ) {
			throw new Error('Either Member or Index must be provided');
		}
		if ( member ) {
			index = this.selectedMembers.indexOf(member);
		}
		if ( index ) {
			this.selectedMembers.splice(index, 1);
			return true;
		}
		return false;
	}

	/**
	 * Add an additional service
	 * @param service
	 */
	addAdditionalService (service: any): void {
		if ( !this.selectedAdditionalServices ) {
			this.selectedAdditionalServices = [ service ];
		} else {
			this.selectedAdditionalServices.push(service);
		}
	}

	/**
	 * Get all additional services
	 * @returns {any[]}
	 */
	get additionalServices (): any[] {
		return this.selectedAdditionalServices;
	}

	/**
	 * Remove an additional service, either by object or index
	 * @param service
	 * @param {number} index
	 * @returns {boolean}
	 */
	removeAdditionalService (service?: any, index?: number) {
		if ( !service && !index ) {
			throw new Error('Either Member or Index must be provided');
		}
		if ( service ) {
			index = this.selectedAdditionalServices.indexOf(service);
		}
		if ( index ) {
			this.selectedAdditionalServices.splice(index, 1);
			return true;
		}
		return false;
	}

	/**
	 * Flag indicating whether or not the order is valid (complete)
	 * @returns {boolean}
	 */
	get orderCompleted (): boolean {
		if ( this.currentStep > 3 && this.hasSelectedFlight() && this.hasSelectedInitialService() && this.hasSelectedMember() ) {
			return true;
		}

		if ( !this.orderRequiresPickup() ) {
			return this.hasSelectedInitialService() && this.hasSelectedFlight() && this.hasSelectedMember();
		} else {
			return this.hasSelectedInitialService() && this.hasSelectedFlight() && this.hasSelectedMember() && this.hasSelectedPickupLocation();
		}
	}

	/**
	 * Flag indicating whether or not the order is valid (complete)
	 * @ignore
	 * @deprecated
	 * @returns {boolean}
	 */
	get orderValid (): boolean {
		return this.orderCompleted;
	}

	/**
	 * Flag indicating whether or not the current order requires to specify a pick-up location
	 * @returns {boolean}
	 */
	orderRequiresPickup (): boolean {
		return find(this.selectedInitialServices, (service: any) => {
			return service.id === '1' || service.id === '3';
		});
	}

	/**
	 * Flag indicating whether or not an initial service has been selected
	 * @returns {boolean}
	 */
	hasSelectedInitialService (): boolean {
		return Array.isArray(this.selectedInitialServices) && this.selectedInitialServices.length > 0;
	}

	/**
	 * Flag indicating whether or not a flight has been selected
	 * @returns {boolean}
	 */
	private hasSelectedFlight (): boolean {
		return this.selectedFlight !== null;
	}

	/**
	 * Flag indicating whether or not the current selection has any members (at least one)
	 * @returns {boolean}
	 */
	private hasSelectedMember (): boolean {
		return this.selectedMembers !== null && this.selectedMembers.length > 0;
	}

	/**
	 * Flag indicating whether or not a pick-up location has been selected (if required)
	 * @returns {boolean}
	 */
	hasSelectedPickupLocation (): boolean {
		return this.selectedPickupLocation !== null;
	}

	setPickupLocation (location) {
		this.selectedPickupLocation = location;
	}

	setDropoffLocation (location) {
		this.selectedPickupLocation = location;
	}

	getPickupLocation () {
		return this.selectedPickupLocation;
	}

	getDropoffLocation () {
		return this.selectedPickupLocation;
	}

	setFlightSearchQuery (departure: string, destination: string, flightDate: any,
	                      flightNumber: string): Promise<boolean> {
		return new Promise((resolve) => {
			this.flightSearchQuery = { departure, destination, flightDate, flightNumber };
			resolve(true);
		});
	}

	getFlightSearchQuery () {
		return this.flightSearchQuery;
	}

	setTravelType (travelType: 'arrival' | 'departure'): Promise<boolean> {
		return new Promise((resolve) => {
			this.travelType = travelType;
			resolve(true);
		});
	}

	getTravelType () {
		return this.travelType;
	}

	getFullAddress (latitude: number, longitude: number): Promise<any> {
		return new Promise((resolve) => {
			this.geoLocationService.coordinatesToAddress(latitude, longitude, true).subscribe((result: any) => {
				resolve(
					{
						address: result.formatted_address,
						city: find(result.address_components, (ad_cmp: any) => ad_cmp.types.indexOf('locality') >= 0) && find(
							result.address_components, (ad_cmp: any) => ad_cmp.types.indexOf('locality') >= 0).long_name,
						district: find(result.address_components,
						               (ad_cmp: any) => ad_cmp.types.indexOf('administrative_area_level_2') >= 0) && find(
							result.address_components,
							(ad_cmp: any) => ad_cmp.types.indexOf('administrative_area_level_2') >= 0).long_name,
						street: find(result.address_components, (ad_cmp: any) => ad_cmp.types.indexOf('route') >= 0) && find(
							result.address_components, (ad_cmp: any) => ad_cmp.types.indexOf('route') >= 0).long_name
					});
			}, (error) => {});
		});
	}

	get bookingType () {
		return this.selectedBookingType;
	}

	getServicePrice (service: any, bookingTypeAware: boolean = false) {
		const membership = this.getMembershipName(); // Individual or Family
		const membershipStatus = this.getMembershipStatus(); // approved, rejected
		const bookingType = this.bookingType; // individual or family
		const remainingServices = this.getNumberOfServicesLeft();


		if ( !bookingType ) {
			return 0;
		}

		if ( bookingType === 'family' ) {
			let price = 0;

			if ( (membership && membership === 'Family') && (membershipStatus && membershipStatus === 'approved') && remainingServices > 0 ) {
				// user has membership
				if ( service.id === '1' ) {
					price = 0;
				} else if ( service.id === '2' ) {
					price = 225;
				} else if ( service.id === '3' ) {
					price = 225;
				}
			} else {
				// user has no membership
				if ( service.id === '1' ) {
					price = 850;
				} else if ( service.id === '2' ) {
					price = 225;
				} else if ( service.id === '3' ) {
					price = 225;
				}
			}

			let addedMembersCount = 5;
			if ( service.id === '1' ) {
				addedMembersCount = this.getApprovedMembersCount() < 5 ? 5 : this.getApprovedMembersCount();
			}

			if ( this.members.length > addedMembersCount ) {
				const additionalMembers = this.members.length - addedMembersCount;

				if ( service.id === '1' ) {
					price += additionalMembers * (175);
				} else if ( service.id === '2' ) {
					price += additionalMembers * (80);
				} else if ( service.id === '3' ) {
					price += additionalMembers * (80);
				}
			}

			return price;
		} else if ( bookingType === 'individual' ) {
			let price = 0;

			if ( (membership && membership === 'Single') && (membershipStatus && membershipStatus === 'approved') && remainingServices > 0 ) {
				// user has membership
				if ( service.id === '1' ) {
					price = 0;
				} else if ( service.id === '2' ) {
					price = 125;
				} else if ( service.id === '3' ) {
					price = 125;
				}
			} else {
				// user has no membership
				if ( service.id === '1' ) {
					price = 500;
				} else if ( service.id === '2' ) {
					price = 125;
				} else if ( service.id === '3' ) {
					price = 125;
				}
			}

			if ( this.members.length > 1 ) {
				const additionalMembers = this.members.length - 1;

				if ( service.id === '1' ) {
					price += additionalMembers * (500);
				} else if ( service.id === '2' ) {
					price += additionalMembers * (125);
				} else if ( service.id === '3' ) {
					price += additionalMembers * (125);
				}
			}

			return price;
		}
	}

	/**
	 * Calculate the subtotal of the order
	 * @returns {number}
	 */
	calculateTotal () {
		let amount = 0;
		if ( this.hasSelectedInitialService() ) {
			for ( const service of this.initialServices ) {
				amount += this.getServicePrice(service, true);
			}
		}
		if ( this.additionalServices ) {
			for ( const service of this.additionalServices ) {
				amount += service.price;
			}
		}
		return amount;
	}

	/**
	 * Calculate the amount of the coupon code
	 * @ignore
	 * @returns {number}
	 */
	calculateCouponValue (): any {
		return 0;
	}

	/**
	 * Calculate the VAT amount of the order
	 * @returns {number}
	 */
	calculateVAT (): any {
		const vat = ((this.calculateTotal() - this.calculateCouponValue()) / 1.05) * 0.05;
		return vat && vat.toFixed(2);
	}

	/**
	 * Calculate the total amount of the order
	 * @returns {number}
	 */
	calculateSubTotal (): any {
		const total = this.calculateTotal() - this.calculateVAT();
		return total && total.toFixed(2);
	}

	createMember (memberData: any, passportScanUrl: string): Promise<any> {
		return new Promise((resolve) => {
			// validate mobile
			const countryCode = memberData[ 'customer-dialCode' ];
			const mobile = countryCode + memberData[ 'customer-mobile' ];

			const data = {
				'salutation': memberData.salutation,
				'first-name': memberData[ 'customer-first-name' ],
				'last-name': memberData[ 'customer-last-name' ],
				'is-child': memberData[ 'customer-is-child' ],
				'passport-expiry': moment(memberData[ 'customer-passport-expiry' ]).toISOString(),
				'nationality': memberData[ 'customer-nationality' ],
				'passport-scan': passportScanUrl,
				'mobile': mobile,
				'email': memberData[ 'customer-email' ],
				'dialCode': countryCode
			};

			resolve(data);
		});
	}

	private convertDataURItoBlob (dataURI) {
		let byteString;
		let mimeString;
		let ia;
		if ( dataURI.split(',')[ 0 ].indexOf('base64') >= 0 ) {
			byteString = atob(dataURI.split(',')[ 1 ]);
		} else {
			byteString = encodeURI(dataURI.split(',')[ 1 ]);
		}
		mimeString = dataURI.split(',')[ 0 ].split(':')[ 1 ].split(';')[ 0 ];
		ia = new Uint8Array(byteString.length);
		for ( let i = 0; i < byteString.length; i++ ) {
			ia[ i ] = byteString.charCodeAt(i);
		}
		return new Blob([ ia ], { type: mimeString });
	}

	uploadMemberPassport (member: any): Promise<string> {
		return new Promise((resolve) => {
			const passport: FormData = new FormData();
			passport.append('filename', member[ 'customer-email' ] + '-pp-scan-' + member[ 'customer-passport-scan' ].name);
			passport.append('image_type', 'passport');

			this.http.post<any>(`${environment.baseUrl}/images/upload`, passport).subscribe((result: any) => {
				resolve(result.url);
			}, (error) => {
				resolve('');
			});
		});
	}


	setMembershipName (name) {
		this.membershipName = name;
	}

	setMembershipStatus (status) {
		this.membershipStatus = status;
	}

	getMembershipName () {
		const membershipDetails = this.localStorageService.get('o_mem_details');
		return membershipDetails && membershipDetails[ 'membership-type' ][ 'label' ];
	}

	getNumberOfServicesLeft (): number {
		const membershipDetails = this.localStorageService.get('o_mem_details');
		if ( membershipDetails && membershipDetails[ 'remaining-service-count' ] ) {
			const count = membershipDetails[ 'remaining-service-count' ];
			return count;
		} else {
			return 0;
		}
	}

	getMembershipStatus () {
		const membershipDetails = this.localStorageService.get('o_mem_details');
		return membershipDetails && membershipDetails[ 'membership-status' ][ 'attributes' ][ 'name' ];
	}

	setApprovedMembersCount (count) {
		// add 1 for the booker
		this.approvedMembersCount = count + 1;
	}

	getApprovedMembersCount () {
		return this.approvedMembersCount;
	}

	get orderData (): Promise<any> {
		return new Promise(async (resolve) => {
			let headers = new HttpHeaders();
			let order: any = {
				data: {
					attributes: {},
					type: 'orders'
				}
			};

			let guest: any;
			if ( this.localStorageService.get('o_ms') ) {
				guest = this.localStorageService.get('o_ms')[ 0 ];

				guest[ 'customer-mobile' ] = `${guest[ 'customer-dialCode' ]}${guest[ 'customer-mobile' ]}`;

				order.data.attributes = { ...guest };
			}


			order.data.attributes = { ...guest };
			order.data.attributes[ 'customer-passport-scan' ] = await this.uploadMemberPassport(guest);

			headers.append('Content-Type', 'application/vnd.api+json');
			headers.delete('Authorization');
			headers.delete('Accept');


			// Add Total:
			order.data.attributes.total = this.calculateTotal();

			// Add Packages
			order.data.attributes[ 'package-ids' ] = [];
			for ( const _package of this.initialServices ) {
				order.data.attributes[ 'package-ids' ].push(_package.id);
			}

			const excludedServiceableIds = [];
			const selectedServices = this.selectedInitialServices[ 0 ];
			if ( selectedServices && selectedServices.services ) {
				selectedServices.services.forEach(service => {
					if ( service.serviceable === false ) {
						excludedServiceableIds.push(service.id);
					}
				});
			}

			//exclude serviceable = false
			order.data.attributes[ 'excluded-services' ] = excludedServiceableIds;

			// Add Members
			order.data.attributes[ 'members' ] = [];
			let index = 0;
			for ( const member of this.members ) {
				// exclude booker
				if ( index !== 0 ) {
					const passportScan = await this.uploadMemberPassport(member);
					order.data.attributes[ 'members' ].push(await this.createMember(member, passportScan));
				}
				index++;
			}

			order.data.attributes[ 'package-availability' ] = this.bookingType === 'family' ? 2 : 1;
			order.data.attributes[ 'include-booker' ] = true;

			// Add Flight Information
			order.data.attributes[ 'booking-type' ] = this.getTravelType();
			order.data.attributes[ 'flight-number' ] = this.flight.attributes[ 'flight-number' ];
			order.data.attributes[ 'booked-date-utc' ] = moment().utc().toISOString();
			order.data.attributes[ 'date-time-utc' ] = moment().utc().toISOString();
			order.data.attributes[ 'flight-date-and-time' ] = this.flight.attributes.scheduled;
			order.data.attributes[ 'origin' ] = this.flight.attributes[ 'departure-airport' ];
			order.data.attributes[ 'destination' ] = this.flight.attributes[ 'arrival-airport' ];

			// Add Address

			if ( this.orderRequiresPickup() ) {
				const latitude = (<GMapsCoordinates>this.getPickupLocation()).latitude;
				const longitude = (<GMapsCoordinates>this.getPickupLocation()).longitude;
				const address = await this.getFullAddress(latitude, longitude);
				if ( address.street ) {
					order.data.attributes[ 'location-street' ] = address.street;
				}
				if ( address.district ) {
					order.data.attributes[ 'location-district' ] = address.district;
				}
				if ( address.city ) {
					order.data.attributes[ 'location-city' ] = address.city;
				}
				order.data.attributes[ 'location-longitude' ] = longitude;
				order.data.attributes[ 'location-latitude' ] = latitude;
			}

			const total = this.calculateTotal();
			const paymentResult = this.localStorageService.get('pc_res');

			if ( total !== 0 ) {
				order.data.attributes[ 'merchant-reference-id' ] = paymentResult[ 'merchant_reference' ];
				order.data.attributes[ 'payment-option' ] = paymentResult[ 'payment_option' ];
			}

			resolve(order);
		});
	}

	addCustomerDetailsOnOrders (customer, order) {
		if ( customer && order ) {
			customer = customer.data.attributes;
			order.data.attributes[ 'customer-first-name' ] = customer[ 'first-name' ];
			order.data.attributes[ 'customer-last-name' ] = customer[ 'last-name' ];
			order.data.attributes[ 'customer-email' ] = customer[ 'email' ];
			order.data.attributes[ 'customer-salutation' ] = customer[ 'salutation' ];
			order.data.attributes[ 'customer-avatar' ] = customer[ 'avatar' ];
			order.data.attributes[ 'customer-mobile' ] = customer[ 'mobile' ];
			order.data.attributes[ 'customer-dial-code' ] = customer[ 'dial-code' ];
			order.data.attributes[ 'customer-passport-scan' ] = customer[ 'passport-scan' ];
			order.data.attributes[ 'customer-passport-expiry-date' ] = customer[ 'passport-expiry-date' ];
			order.data.attributes[ 'customer-nationality' ] = customer[ 'nationality' ];
			return order;
		}
	}

	reservePackage (): Promise<any> {
		const paymentResult = this.localStorageService.get('pc_res');
		const merchantRefId = paymentResult && paymentResult[ 'merchant_reference' ];

		const packageIds = [];
		for ( const _package of this.initialServices ) {
			packageIds.push(_package.id);
		}

		const data: any = {
			'data': {
				'attributes': {
					'merchant-reference-id': merchantRefId || '',
					'reservation-date-time-utc': this.flight.attributes[ 'scheduled-utc' ],
					'reserve-package-ids': packageIds
				},
				'type': 'package-reservations'
			}
		};

		return new Promise(async (resolve) => {
			this.http.post(`${environment.baseUrl}/package-reservations`, data).subscribe((result: any) => {
				resolve(result);
			});
		});
	}

	processOrderWithoutPayment (): Promise<any> {
		return new Promise(async (resolve) => {
			await this.reservePackage();
			const data = await this.orderData;

			this.http.post(`${environment.baseUrl}/orders`, data).subscribe((result: any) => {
				this.resetProgress();
				resolve(result);
			}, (error) => {
				resolve(false);
			});
		});
	}

	isPreloadMembers () {
		const isFullMazaya = find(this.initialServices, (service: any) => {
			return service.id === '1';
		});

		const isFamily = this.selectedBookingType === 'family';
		return isFullMazaya && isFamily;
	}
}
