import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityService } from '../entity/entity.service';

@Injectable()
export class FlightsService extends EntityService {

	entityUrl = 'flights';

	searchByFlightNumber (flightNumber: string) {
		let params = new HttpParams();
		params = params.append('filter[flight-number]', flightNumber);
		return this.listAll(null, params);
	}

	searchByDepartureAirport (departureAirportCodes: string) {
		let params = new HttpParams();
		params = params.append('filter[departure-airport-codes]', departureAirportCodes);
		return this.listAll(null, params);
	}

	searchByArrivalAirport (arrivalAirportCodes: string) {
		let params = new HttpParams();
		params = params.append('filter[arrival-airport-codes]', arrivalAirportCodes);
		return this.listAll(null, params);
	}

	searchByDate (date: string) {
		let params = new HttpParams();
		params = params.append('filter[date]', date);
		return this.listAll(null, params);
	}

	listAirports () {
		return this.listAll('airports');
	}

	getFlightsForRoute (departureAirport: string, arrivalAirport: string) {
		let params = new HttpParams();
		params = params.append('filter[departure-airport-codes]', departureAirport);
		params = params.append('filter[arrival-airport-codes]', arrivalAirport);

		return this.listAll(null, params);
	}
}
