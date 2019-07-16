'use strict';
import { MapTypeStyle } from '@agm/core';

/**
 * Style definitions to convert Google Maps implementation to GrayScale
 * @type {[{elementType: string; featureType: string; stylers: [{saturation: number}]}]}
 */
export const grayScaleMapStyles: MapTypeStyle[] = [
	{
		elementType: 'all',
		featureType: 'all',
		stylers: [
			{
				saturation: -100
			}
		]
	},
	{
		elementType: 'labels.icon',
		stylers: [
			{
				visibility: 'off'
			}
		]
	}
];
