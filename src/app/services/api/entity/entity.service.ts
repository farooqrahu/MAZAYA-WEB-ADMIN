import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Params } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable()
export class EntityService {

	protected entityUrl: string;

	constructor (protected http: HttpClient) { }

	listAll (overrideEntityUrl?: string, params?: Params) {
		const appendUrl = overrideEntityUrl ? overrideEntityUrl : this.entityUrl;
		return this.http.get(`${environment.baseUrl}/${appendUrl}`,{params});
	}

	view (id: number, overrideEntityUrl?: string, include?: string[], language?: string) {
		const appendUrl = overrideEntityUrl ? overrideEntityUrl : this.entityUrl;
		let query = '';
		if ( include && Array.isArray(include) ) {
			query += `?include=${include.join(',')}`;
		}
		let headers = new HttpHeaders();
		if ( language ) {
			headers = headers.append('Accept-Language', language);
		}
		return this.http.get(`${environment.baseUrl}/${appendUrl}/${id}${query}`, { headers });
	}

	delete (id: number, overrideEntityUrl?: string) {
		const appendUrl = overrideEntityUrl ? overrideEntityUrl : this.entityUrl;
		return this.http.delete(`${environment.baseUrl}/${appendUrl}/${id}`);
	}

	update (id: number, data: any, overrideEntityUrl?: string) {
		const appendUrl = overrideEntityUrl ? overrideEntityUrl : this.entityUrl;
		return this.http.patch(`${environment.baseUrl}/${appendUrl}/${id}`, data);
	}

	create (data: any, overrideEntityUrl?: string) {
		const appendUrl = overrideEntityUrl ? overrideEntityUrl : this.entityUrl;
		return this.http.post(`${environment.baseUrl}/${appendUrl}`, data);
	}

}
