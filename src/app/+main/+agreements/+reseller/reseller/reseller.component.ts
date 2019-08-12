import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'ng2-ui-auth';

@Component(
	{
		selector: 'mazaya-reseller',
		templateUrl: './reseller.component.html',
		styleUrls: [ './reseller.component.scss' ]
	})
export class ResellerComponent implements OnInit {
	payload: any;
	role: string;
	packagesDataSource = [];

	columnsToDisplay: string[] = ['name', 'agreementId', 'status', 'actions'];

	pageVar = {
		pageSize: 10,
		pageIndex: 1,
	};
	pageLength: number;
	pageSize: number = 10;
	pageSizeOptions: number[] = [5, 10, 25, 100];

	constructor (private http: HttpClient, private auth: AuthService) {
	}

	public setPageSizeOptions(setPageSizeOptionsInput: any) {
		const pageVar = {
			pageSize: setPageSizeOptionsInput.pageSize,
			pageIndex: setPageSizeOptionsInput.pageIndex += 1
		};
		this.loadAgreements(pageVar);
	}

	ngOnInit () {
		this.payload = this.auth.getPayload();
		this.role = (<string>this.payload[ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' ]).toLowerCase();
		this.loadAgreements(this.pageVar);
	}

	loadAgreements(pageVar: any) {
		let append = '';
		if (this.role === 'reseller') {
			append += `[user-id]=${this.payload['user-id']}`;
		} else if (this.role === 'admin') {
			append += '[role]=reseller';
		}

		this.http.get(`${environment.baseUrl}/agreements?filter${append}&page[size]=${pageVar.pageSize}&page[number]=${pageVar.pageIndex}&sort=-datetime-utc`)
			.subscribe((res: any) => {
				console.log('res: ', res);
				this.packagesDataSource = res.data;
				this.pageLength = res['meta']['total-records'];
			});
	}
}
