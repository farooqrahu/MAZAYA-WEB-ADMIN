import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'ng2-ui-auth';
import { Observable, forkJoin } from 'rxjs';


@Component(
	{
		selector: 'mazaya-reseller-view',
		templateUrl: './reseller-view.component.html',
		styleUrls: [ './reseller-view.component.scss' ]
	})
export class ResellerViewComponent implements OnInit, OnDestroy {
	showError = false;
	role: string;
	reseller: any;
	vouchers: any[];
	private routeSub: Subscription;
	constructor (
		private http: HttpClient,
		private route: ActivatedRoute,
		private auth: AuthService,
		private router: Router
	) {
		const payload = this.auth.getPayload();
		this.role = (<string>payload[ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' ]).toLowerCase();
	}

	ngOnInit () {
		// TODO: use flatmap
		this.routeSub = this.route.params.subscribe(params => {
			this.http.get(`${environment.baseUrl}/agreements/${params['resellerId']}`)
				.subscribe(({ data }: any) => {
					console.log('reseller: ', data);
					this.reseller = data;
				});
		});
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	reject() {
		const data = {
			"data":
				{
					"type": "agreement-status",
					"id": "3",
				},
		};
		this.http.patch(`${environment.baseUrl}/agreements/${this.reseller.id}/relationships/agreement-status`, data)
			.subscribe((res: any) => {
				this.router.navigateByUrl('app/agreements/reseller');
			});
	}
	savePackageList() {
		this.showError = false;

		const promiseArray = [];
		this.reseller.attributes['agreement-package-list'].forEach((pl) => {
			if (pl['quantity'] === 0 || pl['commission'] === 0) {
				this.showError = true;
			}
			const patchData = {
				"data": {
					"attributes": {
						"commission": pl['commission'],
						"quantity": pl['quantity']
					},
					"type": "agreement-packages",
				},
			};
			promiseArray.push(this.http.patch(`${environment.baseUrl}/agreement-packages/${pl['id']}`, patchData));
		});

		if (this.showError) {
			return;
		}

		forkJoin(
			promiseArray[0],
			promiseArray[1],
			promiseArray[2]).subscribe((response) => {
			this.router.navigateByUrl('app/agreements/reseller');
		});
	}
	approve() {
		const data = {
			"data": {
				"type": "agreement-status",
				"id": "2",
			},
		};
		this.showError = false;

		const promiseArray = [];
		this.reseller.attributes['agreement-package-list'].forEach((pl) => {
			if (pl['quantity'] === 0 || pl['commission'] === 0) {
				this.showError = true;
			}
			const patchData = {
				"data": {
					"attributes": {
						"commission": pl['commission'],
						"quantity": pl['quantity']
					},
					"type": "agreement-packages",
				},
			};
			promiseArray.push(this.http.patch(`${environment.baseUrl}/agreement-packages/${pl['id']}`, patchData));
		});

		if (this.showError) {
			return;
		}

		forkJoin(
			promiseArray[0],
			promiseArray[1],
			promiseArray[2]).subscribe((response) => {
			this.http.patch(`${environment.baseUrl}/agreements/${this.reseller.id}/relationships/agreement-status`, data)
				.subscribe((res: any) => {
					this.router.navigateByUrl('app/agreements/reseller');
				});
		});
	}
}
