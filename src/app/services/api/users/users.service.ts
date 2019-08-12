import { Injectable } from '@angular/core';
import { EntityService } from '../entity/entity.service';
import { environment } from '../../../../environments/environment';
import {HttpHeaders} from "@angular/common/http";

@Injectable()
export class UsersService extends EntityService {

	entityUrl = 'users';

	viewUser (id: number) {
		const includes: string[] = [
			'user-roles',
			'devices',
			'driver-order-services',
			'order-services',
			'orders-drivers',
			'user-logins'
		];
		return this.view(id, null, includes);
	}

	viewCustomer (id: number) {
		const includes: string[] = [
			'user',
		];
		return this.view(id, 'customers', includes);
	}

	updateAvatar (userId: number, formData: FormData) {
		return this.http.post(`${environment.baseUrl}/images/customer/${userId}`, formData);
	}

	deactivateUser (userId: number) {
		const data = {
			data: {
				attributes: {
					'de-activated': true
				},
				type: 'users'
			}
		};
		return this.http.patch(`${environment.baseUrl}/users/${userId}`, data);
	}

	approveUser (userId: number) {
		const data = {
			data: {
				attributes: {
					'is-approved': true,
				},
				type: 'users'
			}
		};
		return this.http.put(`${environment.baseUrl}/users/${userId}/approval`, data);
	}

	rejectUser (userId: number) {
		const data = {
			data: {
				attributes: {
					'is-approved': false,
				},
				type: 'users'
			}
		};
		return this.http.put(`${environment.baseUrl}/users/${userId}/rejection`, data);
	}

	activateUser (userId: number) {
		const data = {
			data: {
				attributes: {
					'de-activated': false
				},
				type: 'users'
			}
		};
		return this.http.patch(`${environment.baseUrl}/users/${userId}`, data);
	}

	deleteUser (userId: number) {
		const data = {
			data: {
				attributes: {
					deleted: true
				},
				type: 'users'
			}
		};
		return this.http.delete(`${environment.baseUrl}/users/${userId}`);
	}

	restoreUser (userId: number) {
		const data = {
			data: {
				attributes: {
					deleted: false
				},
				type: 'users'
			}
		};
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
			}),
		};
		return this.http.patch(`${environment.baseUrl}/users/${userId}/restore`, data, httpOptions);
	}
}
