import { Injectable } from '@angular/core';
import { GMapsCoordinates } from '../../interfaces/g-maps-coordinates';
import { Observable } from 'rxjs/Observable';
// import * as GoogleMaps from '@google/maps';
import { environment } from '../../../environments/environment';
import { getCenter, getBounds } from 'geolib';

/**
 * Service to perform geocoding processes like
 * converting addresses into coordinates and vice versa
 */
@Injectable()
export class GeocodingService {

	private client;

	/**
	 * Constructor
	 */
	constructor () {
		// this.client = GoogleMaps.createClient({ key: environment.googleMaps.key });
	}

	/**
	 * Convert an address string into Coordinates
	 * Returns the result as an observable
	 * @param {string} address
	 * @param raw
	 * @returns {Observable<GMapsCoordinates>}
	 */
	addressToCoordinates (address: string, raw: boolean = false): Observable<GMapsCoordinates> {
		return new Observable<GMapsCoordinates>((observer) => {
			if ( !address || address.length === 0 ) {
				observer.error(null);
				return;
			}
			this.client.geocode({ address }, (error, result) => {
				if ( error ) {
					observer.error(error);
				} else {
					if ( result.status === 200 && result.json.status === 'OK' && result.json.results.length > 0 ) {
						const results = result.json.results[ 0 ];
						if ( raw ) {
							observer.next(results);
						} else {
							const response: GMapsCoordinates = {
								latitude: results.geometry.location.lat,
								longitude: results.geometry.location.lng,
								address: {
									formatted: results.formatted_address
								}
							};
							observer.next(response);
						}
					} else {
						observer.error(null);
					}
				}
			});
		});
	}

	coordinatesToAddress (lat: number, long: number, raw: boolean = false): Observable<any> {
		return new Observable<any>((observer) => {
			if ( !lat || !long ) {
				observer.error('Not enough Arguments');
				return;
			}
			const location = { lat: lat, lng: long };
			this.client.reverseGeocode({ latlng: location }, (error, result) => {
				if ( error ) {
					observer.error(error);
				} else {
					if ( result.status === 200 && result.json.status === 'OK' && result.json.results.length > 0 ) {
						if ( raw ) {
							observer.next(result.json.results[ 0 ]);
						} else {
							observer.next(result.json.results[ 0 ].formatted_address);
						}
					} else {
						observer.error(null);
					}
				}
			});
		});
	}

	createBoundingCenter (coordinates: GMapsCoordinates[]) {

		const boundingCoordinates = [];

		for ( const coordinate of coordinates ) {
			const newCoordinates = { latitude: coordinate.latitude, longitude: coordinate.longitude };
			boundingCoordinates.push(newCoordinates);
		}

		const center = getCenter(boundingCoordinates);
		center.latitude = parseFloat(center.latitude.toString());
		center.longitude = parseFloat(center.longitude.toString());

		return center;
	}

	createBounds (coordinates: GMapsCoordinates[]) {
		const boundingCoordinates = [];

		for ( const coordinate of coordinates ) {
			const newCoordinates = { latitude: coordinate.latitude, longitude: coordinate.longitude };
			boundingCoordinates.push(newCoordinates);
		}

		const bounds = getBounds(boundingCoordinates);

		return {
			east: bounds.minLng,
			west: bounds.maxLng,
			north: bounds.minLat,
			south: bounds.maxLat
		};
	}
}
