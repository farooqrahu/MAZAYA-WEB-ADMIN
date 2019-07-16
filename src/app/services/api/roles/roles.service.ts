import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class RolesService {

	roles: any[] = [];

	constructor (private http: HttpClient) {
		this.loadRoles();
	}

	async loadRoles () {
		if ( !this.roles || this.roles.length === 0 ) {
			this.roles = await this.fetchRolesAsync();
		}
		return this.roles;
	}

	private fetchRolesAsync (): Promise<any[]> {
		return new Promise((resolve) => {
			this.http.get(`${environment.baseUrl}/roles`).subscribe((result: {data:any[]}) => {
				resolve(result.data);
			});
		});
	}
}
