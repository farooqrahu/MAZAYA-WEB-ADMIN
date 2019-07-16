import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { EntityService } from '../entity/entity.service';

@Injectable()
export class CapacitiesService extends EntityService {

	entityUrl = 'capacity-matrices';

	createForPackage (packageId: number, from: string, to: string, capacity: number) {
		const data = {
			data: {
				type: 'capacity-matrices',
				attributes: {
					'from-date-and-time-utc': from,
					'to-date-and-time-utc': to,
					capacity
				},
				relationships: {
					package: {
						data: {
							type: 'packages',
							id: packageId
						}
					}
				}
			}
		};
		return this.http.post(`${environment.baseUrl}/${this.entityUrl}`,data);
	}

}
