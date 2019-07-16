'use strict';

/**
 * Address format for Google Maps Addresses
 */
export interface GMapsAddress {
	/**
	 * The formatted address
	 */
	formatted?: string;

	/**
	 * The locality the address belongs to
	 */
	locality?: string;

	/**
	 * Administrative Area Level 2 the address belongs to
	 */
	administrativeAreaLevel2?: string;

	/**
	 * Administrative Area Level 1 the address belongs to
	 */
	administrativeAreaLevel1?: string;

	/**
	 * The Country the address belongs to
	 */
	country?: string;
}

/**
 * Coordinates format for Google Maps Coordinates
 */
export interface GMapsCoordinates {
	/**
	 * Latitude of the address
	 */
	latitude: number;

	/**
	 * Longitude of the address
	 */
	longitude: number;

	/**
	 * The address these coordinates belong to
	 */
	address?: GMapsAddress;
}
