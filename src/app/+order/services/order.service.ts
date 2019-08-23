import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { GMapsCoordinates } from 'app/interfaces/g-maps-coordinates';
import { GeoCodingService } from './geocoding.service';
import { find } from 'lodash';

@Injectable()
export class CheckoutService {
  constructor(private geoLocationService: GeoCodingService, private orderService: OrderService) { }

  private get passengerFromLS(): any {
    return localStorage.getItem('waPassengers') ? JSON.parse(localStorage.getItem('waPassengers')).members : null;
  }

  private get total(): string {
    return JSON.parse(localStorage.getItem('waTotal')) || null;
  }

  private get selectedPkgs(): any {
    return JSON.parse(localStorage.getItem('waSelectedPackages')) || null;
  }

  private get bookingType(): string {
    return localStorage.getItem('waBookingType') || null;
  }

  private get travelType(): string {
    return localStorage.getItem('waTravelType') || '';
  }

  private get flight(): any {
    return JSON.parse(localStorage.getItem('waSelectedFlight')) || '';
  }

  private get location(): any {
    return JSON.parse(localStorage.getItem('waLocation')) || null;
  }

  public uploadPassport(member: any): Promise<string> {
    return new Promise((resolve) => {
      const passport: FormData = new FormData();
      passport.append('filename', member['email'] + '-pp-scan-' + Date.now() + '.png');
      passport.append('image_type', 'passport');

      this.orderService.uploadPassport(passport).subscribe((result: any) => resolve(result.url), () => resolve(''));
    });
  }

  private getFullAddress(latitude: number, longitude: number): Promise<any> {
    return new Promise((resolve) => {
      const LatLng = new google.maps.LatLng(latitude, longitude);

      this.geoLocationService.geocode(LatLng).subscribe((results: any) => {
        const addressComponents = results[0].address_components;
        const fmt_address = results[0].formatted_address;
        const city = find(addressComponents, (add: any) => add.types.indexOf('locality') >= 0)
          && find(addressComponents, (add: any) => add.types.indexOf('locality') >= 0).long_name || '';
        const district = find(addressComponents, (ad_cmp: any) => ad_cmp.types.indexOf('administrative_area_level_2') >= 0) && find(addressComponents, (ad_cmp: any) => ad_cmp.types.indexOf('administrative_area_level_1') >= 0).long_name || ''
        const street = find(addressComponents, (ad_cmp: any) => ad_cmp.types.indexOf('route') >= 0) && find(addressComponents, (ad_cmp: any) => ad_cmp.types.indexOf('route') >= 0).long_name || '';

        const address = {
          address: fmt_address,
          city: city,
          district: district,
          street: street
        }

        resolve(address);
      }, (error) => {
        console.log('getFullAddress', error);
      });
    });
  }

  public async getOrderData() {
    return new Promise(async (resolve) => {
      let order: any = {
        data: {
          attributes: {},
          type: 'orders'
        }
      };

      let passportVars: any = {};
      let passenger = this.passengerFromLS ? this.passengerFromLS[0] : null;

      if (!passenger) resolve(null);

      passportVars['mobile'] = `${passenger['dialCode']}${passenger['mobile']}`;
      passportVars['customer-email'] = passenger['email'];
      order.data.attributes['customer-passport-scan'] = await this.uploadPassport(passportVars);

      order.data.attributes['customer-dial-code'] = passenger['dialCode'];
      order.data.attributes['customer-email'] = passenger['email'];
      order.data.attributes['customer-first-name'] = passenger['first-name'];
      order.data.attributes['customer-last-name'] = passenger['last-name'];
      order.data.attributes['customer-mobile'] = passenger['mobile'];
      order.data.attributes['customer-nationality'] = passenger['nationality'];
      order.data.attributes['customer-passport-expiry-date'] = passenger['passport-expiry-date'];

      order.data.attributes['payment-type-id'] = 2;

      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/vnd.api+json');
      headers.delete('Authorization');
      headers.delete('Accept');

      order.data.attributes.total = this.total;

      order.data.attributes['package-ids'] = [];
      if (this.selectedPkgs && this.selectedPkgs.length > 0) {
        this.selectedPkgs.forEach(item => {
          order.data.attributes['package-ids'].push(item.id);
        });
      }

      //add members
      order.data.attributes['members'] = [];
      let index = 0;
      if (this.passengerFromLS) {
        for (const member of this.passengerFromLS) {
          if (index !== 0) {
            member['passport-scan'] = await this.uploadPassport(passportVars);
            order.data.attributes['members'].push(member);
          }
          index++;
        }
      }

      order.data.attributes['package-availability'] = this.bookingType === 'Individual' ? 1 : 2;
      order.data.attributes['include-booker'] = true;

      // flight information
      order.data.attributes['booking-type'] = this.travelType;
      order.data.attributes['flight-number'] = this.flight.attributes['flight-number'];
      order.data.attributes['booked-date-utc'] = moment().utc().toISOString();
      order.data.attributes['date-time-utc'] = moment().utc().toISOString();
      order.data.attributes['flight-date-and-time'] = this.flight.attributes.scheduled;
      order.data.attributes['origin'] = this.flight.attributes['departure-airport'];
      order.data.attributes['destination'] = this.flight.attributes['arrival-airport'];

      if (this.location) {
        const latitude = this.location.geometry.location.lat;
        const longitude = this.location.geometry.location.lng;
        const address = await this.getFullAddress(latitude, longitude);

        if (address.street) order.data.attributes['location-street'] = address.street;
        if (address.district) order.data.attributes['location-district'] = address.district;
        if (address.city) order.data.attributes['location-city'] = address.city;
        order.data.attributes['location-longitude'] = longitude;
        order.data.attributes['location-latitude'] = latitude;
      }

      resolve(order);
    }).catch((err) => {
      console.log(err);
    });
  }
}

@Injectable()
export class OrderService {
  constructor(private http: HttpClient) { }

  private get getCommonHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Accept-Language', 'en');
    return headers;
  }

  public uploadPassport(passport: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/images/upload`, passport)
  }

  public setOrder(order: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}/orders`, order, { headers: this.getCommonHeaders });
  }

  public getNationalities(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/nationalities?page[size]=500`);
  }

  public getAirports(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/airports`);
  }

  public getFlights(params: HttpParams, httpHeaders: HttpHeaders): Observable<any> {
    return this.http.get(`${environment.baseUrl}/flights`, { params, headers: httpHeaders })
  }

  public getPackages(params: HttpParams, httpHeaders: HttpHeaders): Observable<any> {
    return this.http.get(`${environment.baseUrl}/packages`, { params, headers: httpHeaders });
  }

  public getUserAgreement(userId: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}/agreements?filter[user-id]=${userId}&include=user`)
  }
}

@Injectable()
export class MyOrderService {
  public progressIndex$: Observable<number>;
  private progressIndex: BehaviorSubject<number> = new BehaviorSubject(null);

  public progressLine$: Observable<number>;
  private progressLine: BehaviorSubject<number> = new BehaviorSubject(null);

  public flight$: Observable<any>;
  private flight: BehaviorSubject<any> = new BehaviorSubject(null);

  public pkgs$: Observable<any[]>;
  private pkgs: BehaviorSubject<any[]> = new BehaviorSubject(null);

  public psngrs$: Observable<any>;
  private psngrs: BehaviorSubject<any> = new BehaviorSubject(null);

  public address$: Observable<any>;
  private address: BehaviorSubject<any> = new BehaviorSubject(null);

  public showPaymentOption$: Observable<boolean>;
  private showPaymentOption: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public totalAmount$: Observable<number>;
  private totalAmount: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor() {
    this.progressIndex$ = this.progressIndex.asObservable();
    this.progressLine$ = this.progressLine.asObservable();

    this.flight$ = this.flight.asObservable();
    this.pkgs$ = this.pkgs.asObservable();
    this.psngrs$ = this.psngrs.asObservable();
    this.address$ = this.address.asObservable();
    this.showPaymentOption$ = this.showPaymentOption.asObservable();
    this.totalAmount$ = this.totalAmount.asObservable();
  }

  public clearService(): void {
    this.totalAmount.next(null);
    this.address.next(null);
    this.pkgs.next(null);
    this.flight.next(null);
    this.progressLine.next(null);
    this.progressIndex.next(null);
  }

  public setTotalAmount(amount: any): void {
    this.totalAmount.next(amount);
  }

  public setPaymentOption(isVisible: boolean): void {
    this.showPaymentOption.next(isVisible);
  }

  public setAddress(address: any): void {
    this.address.next(address);
  }

  public setPassengers(psngrs: any): void {
    this.psngrs.next(psngrs);
  }

  public setPkg(pkg: any): void {
    this.pkgs.next(pkg);
  }

  public setFlight(flight: any): void {
    this.flight.next(flight);
  }

  public setProgressIndex(index: number): void {
    this.progressIndex.next(index);
  }

  public setProgressLine(index: number): void {
    this.progressLine.next(index);
  }
}

@Injectable()
export class FlightService {
  public api = environment.baseUrl;
  public resource: any = {
    airports: 'airports',
    airport: 'airports/:code',
    flight: 'flights/:flightNumber',
    searchFlights: 'flights',
  };
  public data: any;

  constructor(private httpClient: HttpClient) { }

  public get(api, resource, options) {
    return new Promise((resolve, reject) => {
      this
        .httpClient
        .get(`${api}/${resource}`, options)
        .subscribe(
          (data: any) => {
            resolve(data);
          },
          (err: any) => {
            reject();
          }
        );
    });
  }

}
