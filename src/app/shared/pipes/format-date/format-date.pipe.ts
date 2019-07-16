import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe(
	{
		name: 'formatDate'
	})
export class FormatDatePipe implements PipeTransform {

	transform (value: string | null | undefined, fromUTC: boolean = false): string | null | undefined {
		// If value is not set or is null or undefined, return the value directly
		if ( value ) {
			// If value is set, convert to moment object
			const result = moment(value);
			if ( fromUTC ) {
				// If date should be converted from UTC, add current UTC offset to converted moment object
				result.add(moment().utcOffset(), 'm');
			}
			// Format moment object as date string and return
			return result.local().format('Do MMMM YYYY [at] HH:mm');
		} else {
			// Return original value
			return value;
		}
	}

}
