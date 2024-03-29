import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from "ng2-ui-auth";
import * as moment from 'moment';
import { VouchersService } from '../../../../services/api/vouchers/vouchers.service';
import { ApproveAgreementModalComponent } from '../../../../dialogs/approve-agreement-modal/approve-agreement-modal.component';
import { MatDialog } from "@angular/material";
import { RejectAgreementModalComponent } from '../../../../dialogs/reject-agreement-modal/reject-agreement-modal.component';

@Component(
	{
		selector: 'mazaya-corporate-view',
		templateUrl: './corporate-view.component.html',
		styleUrls: [ './corporate-view.component.scss' ]
	})
export class CorporateViewComponent implements OnInit, OnDestroy {
	showError = false;
	role: string;
	corporate: any;
	userAttributes: any;
	vouchers: any = [];
	private routeSub: Subscription;
	constructor (
		private http: HttpClient,
		private auth: AuthService,
		private voucherService: VouchersService,
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog) {
		const payload = this.auth.getPayload();
		this.role = (<string>payload[ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' ]).toLowerCase();
	}

	ngOnInit () {
		// TODO: use flatmap
		this.routeSub = this.route.params.subscribe(params => {
			this.http.get(`${environment.baseUrl}/agreements/${params['corporateId']}?include=user`)
				.subscribe(({ data, included }: any) => {
					this.corporate = data;
					this.userAttributes = included[0];
					console.log('corporate: ', this.corporate);
					console.log('userAttributes: ', this.userAttributes);
					this.http.get(`${environment.baseUrl}/vouchers?filter[agreement-id]=${this.corporate.id}`)
						.subscribe(({ data }: any) => {
							console.log('vouchers /data: ', data);
							this.vouchers = data;
						});
				});
		});
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	onNumberInputChange(ev) {
		if (ev.target.value < 0) {
			ev.target.value = 0;
		}
		return ev;
	}

	reject(event) {
		event.preventDefault();
		const dialogRef = this.dialog.open(RejectAgreementModalComponent, {
			data: {
				agreement: this.corporate,
			}
		});
		dialogRef.afterClosed().subscribe((result: any) => {
			if (result) {
				this.router.navigateByUrl('app/agreements/corporate');
			}
		});
	}
	saveVoucher() {
		console.log('here');
		let voucherSub = null;
		this.showError = false;

		const vouchersCopy = JSON.parse(JSON.stringify(this.vouchers));

		this.vouchers.forEach((voucher) => {
			voucher.attributes['voucher-package-list'].map((pkg) => {
				if (pkg['discount-percentage'] === 0) {
					this.showError = true;
				}
				console.log('pkg: ', pkg);
				delete pkg.id;
				delete pkg['package-name'];
				return pkg;
			});

			const voucherData: any = {
				'data': {
					'attributes': {
						'validity-start-date-and-time-utc': moment(voucher.attributes['validity-start-date-and-time-utc']).format(),
						'validity-end-date-and-time-utc': moment(voucher.attributes['validity-end-date-and-time-utc']).format(),
						'code': voucher.attributes.code,
						'voucher-package-list': voucher.attributes['voucher-package-list']
					},
					"type": "vouchers"
				}
			};

			voucherSub = this.voucherService.updateVoucher(voucherData, voucher.id);
		});

		if (this.showError) {
			this.vouchers = vouchersCopy;
			return;
		}

		voucherSub.subscribe(res => {
			console.log('voucher res: ', res);
			this.router.navigateByUrl('app/agreements/corporate');
		});
	}

	approve(event) {
		let voucherSub = null;
		this.showError = false;

		event.preventDefault();

		const vouchersCopy = JSON.parse(JSON.stringify(this.vouchers));

		this.vouchers.forEach((voucher) => {
			voucher.attributes['voucher-package-list'].map((pkg) => {
				if (pkg['discount-percentage'] === 0) {
					this.showError = true;
				}
				delete pkg.id;
				delete pkg['package-name'];
				return pkg;
			});

			const voucherData: any = {
				'data': {
					'attributes': {
						'validity-start-date-and-time-utc': moment(voucher.attributes['validity-start-date-and-time-utc']).format(),
						'validity-end-date-and-time-utc': moment(voucher.attributes['validity-end-date-and-time-utc']).format(),
						'code': voucher.attributes.code,
						'voucher-package-list': voucher.attributes['voucher-package-list']
					},
					"type": "vouchers"
				}
			};

			voucherSub = this.voucherService.updateVoucher(voucherData, voucher.id);
		});

		if (this.showError) {
			this.vouchers = vouchersCopy;
			return;
		}

		const dialogRef = this.dialog.open(ApproveAgreementModalComponent, {
			data: {
				agreement: this.corporate,
				observable: voucherSub,
			}
		});
		dialogRef.afterClosed().subscribe((result: any) => {
			if (result) {
				this.router.navigateByUrl('app/agreements/corporate');
			}
		});
	}
}
