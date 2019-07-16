import { Injectable } from '@angular/core';
import { EntityService } from '../entity/entity.service';

@Injectable()
export class PackagesService extends EntityService {

	entityUrl = 'packages';

	setPackageActive (packageId: number) {
		const data = {
			data: {
				attributes: {
					active: true
				},
				id: packageId,
				type: 'packages'
			}
		};
		return this.update(packageId, data);
	}

	setPackageInactive (packageId: number) {
		const data = {
			data: {
				attributes: {
					active: false
				},
				id: packageId,
				type: 'packages'
			}
		};
		return this.update(packageId, data);
	}

	setPackageOnHold (packageId: number) {
		const data = {
			data: {
				attributes: {
					'on-hold': true
				},
				id: packageId,
				type: 'packages'
			}
		};
		return this.update(packageId, data);
	}

	setPackageNotOnHold (packageId: number) {
		const data = {
			data: {
				attributes: {
					'on-hold': false
				},
				id: packageId,
				type: 'packages'
			}
		};
		return this.update(packageId, data);
	}
}
