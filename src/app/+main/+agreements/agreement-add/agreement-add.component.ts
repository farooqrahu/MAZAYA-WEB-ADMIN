import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { PackagesService } from 'app/services/api/packages/packages.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { VouchersService } from 'app/services/api/vouchers/vouchers.service';
import * as moment from 'moment';
import * as XLSX from 'ts-xlsx';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from "ng2-ui-auth";

@Component({
	selector: 'mazaya-agreement-add',
	templateUrl: './agreement-add.component.html',
	styleUrls: ['./agreement-add.component.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class AgreementAddComponent implements OnInit {
	public listOfPackages: any;
	public voucherForm: FormGroup;
	public fileContent: any;
	public voucherCodes: string[] = [];
	public checkedCodes: any[] = [];
	public showMFPackage: boolean = false;
	public selectedPackages: any[] = [];
	selectedVoucherOptions = '';

	selectedType: string;
	selectedAccount = null;
	selectedVouchers = [];
	vouchers: [];
	searchText = '';
	textChanged: Subject<string> = new Subject<string>();
	pageVar = {
		pageSize: 10,
		pageIndex: 1,
	};
	users: [];
	isDisplayWith = false;
	role: string;
	payload: any;

	constructor(
		private router: Router,
		private voucherService: VouchersService,
		public fb: FormBuilder,
		private packagesService: PackagesService,
		private http: HttpClient,
		private auth: AuthService
	) {
		this.payload = this.auth.getPayload();
		this.role = (<string>this.payload[ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' ]).toLowerCase();

		this.voucherForm = fb.group(
			{
				voucherCount: [1],
				packagesId: [null, Validators.compose([Validators.required])],
				packages: new FormArray([]),
				voucherCodes: new FormArray([]),
				validStartDate: [moment().format(), Validators.compose([Validators.required])],
				validEndDate: [moment().format(), Validators.compose([Validators.required])],
			}
		);

		if (this.role !== 'admin') {
			if (this.role === 'corporate') {
				this.selectedType = '8';
			} else if (this.role === 'reseller') {
				this.selectedType = '3';
			}
		}

		this.textChanged.pipe(
			debounceTime(1000), // wait 1000ms after the last event before emitting last event
			distinctUntilChanged() // only emit if value is different from previous value
		)
			.subscribe(model => {
				this.searchText = model;
				if (this.isDisplayWith) {
					this.isDisplayWith = false;
					return;
				}
				this.http.get(`${environment.baseUrl}/users?filter[deleted]=ne:true&filter[role]=${this.selectedType}&filter[first-name]=like:${this.searchText}`)
					.subscribe((res: any) => {
						this.users = res.data;
					});
			});
	}

	ngOnInit() {
		this.getPackages();
	}

	onAddAgreement() {
		const data = {
			"data": {
				"userid": this.selectedAccount.id,
				"vouchers": this.selectedVouchers,
			},
		};
	}

	displayFn(user) {
		if (user) {
			this.isDisplayWith = true;
			this.selectedAccount = user;
		}
		return user && user.attributes ? user.attributes['first-name'] : '';
	}

	onChangeSearchText(text: string) {
		this.textChanged.next(text);
	}

	onSelectType(ev) {
		this.selectedType = ev.value;
		this.users = [];
		this.searchText = '';
		this.selectedAccount = null;
		console.log('this.selectedType: ', this.selectedType);
	}

	public onResetFile(): void {
		this.voucherCodes = [];
	}

	public onVoucherChange(event: any): void {
		const voucherCodes = <FormArray>this.voucherForm.get('voucherCodes') as FormArray;

		if (event.checked) {
			voucherCodes.push(new FormControl(event.source.value))
		} else {
			const i = voucherCodes.controls.findIndex(x => x.value === event.source.value);
			voucherCodes.removeAt(i);
		}
	}

	public getPackage(id: any): any {
		return this.listOfPackages.filter(x => x.id == id)[0];
	}

	public removePackage(id: number): void {
		const pkgs = <FormArray>this.voucherForm.get('packages') as FormArray;
		pkgs.removeAt(pkgs.value.findIndex(x => x['package-id'] === +id));
	}

	public selectPackage(event: any, form: any): void {
		const pkgs = <FormArray>this.voucherForm.get('packages') as FormArray;

		//manually remove all packages
		for (let i = 0; i < 3; i++) {
			pkgs.removeAt(pkgs.value.findIndex(x => x['package-id'] === i));
		}

		pkgs.reset();

		event.forEach(id => {
			let newPkg: any = {
				'discount-percentage': 0,
				'discount-amount': 1,
				'redemptions': 1,
				'package-id': +id,
				'status-id': 2,
				'package-availability-id': 1,
				'isPercentage': 'true'
			};
			pkgs.push(this.fb.group(newPkg));
		});
	}

	public genVoucherCode(len: number, an: string): string {
		an = an && an.toLowerCase();
		let str = "", i = 0, min = an == "a" ? 10 : 0, max = an == "n" ? 10 : 62;
		for (; i++ < len;) {
			let r = Math.random() * (max - min) + min << 0;
			str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);

		}

		return str.toUpperCase();

	}


	public parseFileToArray(event: any): void {


		const fileReaded = event.target.files[0];
		const extension = fileReaded.name.split('.')[1];

		let reader: FileReader = new FileReader();
		if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
			reader.onload = () => {
				const result: any = reader.result;
				const data = new Uint8Array(result);
				const arr = [];
				for(let i = 0; i != data.length; ++i) {
					arr[i] = String.fromCharCode(data[i]);
				}
				const bstr = arr.join('');
				const workbook: any = XLSX.read(bstr, { type: 'binary' });
				this.voucherCodes = [];
				for (const sheet in workbook.Sheets) {
					for (const string in workbook.Sheets[sheet]) {
						if (string !== '!ref\n') {
							const v = workbook.Sheets[sheet][string].v;
							if (v) {
								const allTextLines = v.split(/\r|\n|\r/);
								const headers = allTextLines[0].split(',');
								for (const key in allTextLines) {
									const data = allTextLines[key].split(',');
									if (data.length === headers.length) {
										for (const i in headers) {
											if (data[i].length > 0) {
												this.voucherCodes.push(data[i]);
											}
										}
									}
								}
							}
						}
					}
				}
			};
			reader.readAsArrayBuffer(fileReaded);
		} else {
			reader.readAsText(fileReaded);
			reader.onload = () => {
				const result: any = reader.result;
				const allTextLines = result.split(/\r|\n|\r/);
				const headers = allTextLines[0].split(',');
				this.voucherCodes = [];
				for (const key in allTextLines) {
					const data = allTextLines[key].split(',');
					if (data.length === headers.length) {
						for (const i in headers) {
							if (data[i].length > 0) {
								this.voucherCodes.push(data[i]);
							}
						}
					}
				}
			}
		}
	}

	public onPackageChange(event: any): void {
		const voucherCodes = <FormArray>this.voucherForm.get('voucherCodes') as FormArray;

		if (event.checked) {
			voucherCodes.push(new FormControl(event.source.value))
		} else {
			const i = voucherCodes.controls.findIndex(x => x.value === event.source.value);
			voucherCodes.removeAt(i);
		}
	}

	public createVoucher(): void {
		if (!this.selectedAccount && this.role === 'admin') {
			alert('Please select an account to add an agreement.');
			return;
		}

		//generate voucher
		this.voucherCodes.push(`${this.genVoucherCode(4, 'A')}${this.genVoucherCode(3, 'N')}`);

		//voucher payload
		const voucherData: any = {
			"data": {
				"attributes": {
					"validity-start-date-and-time-utc": moment(this.voucherForm.get('validStartDate').value).format(),
					"validity-end-date-and-time-utc": moment(this.voucherForm.get('validEndDate').value).format(),
					"codes": this.voucherCodes,
					"voucher-package-list": this.voucherForm.get('packages').value
				},
				"type": "vouchers",
				"relationships": {
					"agreement": {
						"data": {
							"type": "agreements",
							"id": null,
						},
					},
				},
			},
		};

		const packageList = [];
		voucherData['data']['attributes']['voucher-package-list'].map(v => {
			console.log('v: ', v);
			v.isPercentage = v.isPercentage === 'true';
			packageList.push({
				"package-id": v['package-id'],
				"commission": v['discount-percentage'],
				"quantity": v['redemptions'],
			});
			// v['discount-percentage'] = 1;
			return v;
		});

		console.log('voucherData: ', voucherData);

		const agreementData = {
			"data": {
				"attributes": {
					"user-id": this.selectedAccount && this.selectedAccount.id || this.payload['user-id'],
				},
				"type": "agreements",
			},
		};
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/vnd.api+json',
				'Accept-Language': 'en',
			}),
		};
		if (this.selectedType === '8') {
			this.voucherService.createVoucher(voucherData).subscribe((res: any) => {
				const { id } = res.data[0];
				agreementData.data.attributes['agreement-type-id'] = 2;
				agreementData.data.attributes['voucher-ids'] = [id];

				console.log('voucherService res: ', res);

				console.log('agreementData: ', agreementData);
				this.http.post(`${environment.baseUrl}/agreements`, agreementData, httpOptions)
					.subscribe((res: any) => {
						console.log('agreements res: ', res);
						this.router.navigateByUrl('app/agreements/corporate');
					}, error => {
						console.log('agreements error: ', error);
					});
			}, error => {
				console.log('voucherService error: ', error);
			});
		} else {
			agreementData.data.attributes['agreement-type-id'] = 1;
			agreementData.data.attributes['agreement-package-list'] = packageList;
			console.log('reseller agreementDate: ', agreementData);

			this.http.post(`${environment.baseUrl}/agreements`, agreementData, httpOptions)
				.subscribe((res: any) => {
					console.log('agreements res: ', res);
					this.router.navigateByUrl('app/agreements/reseller');
				}, error => {
					console.log('agreements error: ', error);
				});
		}
	}

	public getPackages(): void {
		this.packagesService.listAll().subscribe((result: any) => {
			this.listOfPackages = result.data.filter((_package: any) => !_package.attributes['web-only']);
			// this.selectFirstPackage();
			this.selectAllPackages();
		});
	}

	public onDiscountChange(event: any, pkg: any): void {
		if (event.value === 'true') {
			pkg.get('isPercentage').patchValue('true');
			pkg.get('discount-percentage').patchValue(pkg.get('discount-amount').value);
			pkg.get('discount-amount').patchValue(0);
		} else {
			pkg.get('isPercentage').patchValue('false');
			pkg.get('discount-amount').patchValue(pkg.get('discount-percentage').value);
			pkg.get('discount-percentage').patchValue(0);
		}
	}

	public selectFirstPackage(): void {
		setTimeout(() => {
			console.log('this.listOfPackages: ', this.listOfPackages);
			const firstPackage = this.listOfPackages.filter(x => x.id === this.listOfPackages[0].id)[0];
			const packagesFormArray = <FormArray>this.voucherForm.get('packages') as FormArray;

			this.voucherForm.get('packagesId').patchValue([this.listOfPackages[0].id]);

			const defaultPackage = {
				"discount-percentage": 0,
				"discount-amount": 1,
				"redemptions": 1,
				"package-id": +firstPackage.id,
				"status-id": 2,
				"package-availability-id": 1,
				"isPercentage": 'false'
			}
			packagesFormArray.push(this.fb.group(defaultPackage));
		});
	}

	public selectAllPackages(): void {
		setTimeout(() => {
			console.log('this.listOfPackages: ', this.listOfPackages);
			const firstPackage = this.listOfPackages.filter(x => x.id === this.listOfPackages[0].id)[0];
			const secondPackage = this.listOfPackages.filter(x => x.id === this.listOfPackages[1].id)[0];
			const thirdPackage = this.listOfPackages.filter(x => x.id === this.listOfPackages[2].id)[0];
			const packagesFormArray = <FormArray>this.voucherForm.get('packages') as FormArray;

			this.voucherForm.get('packagesId').patchValue([this.listOfPackages[0].id, this.listOfPackages[1].id, this.listOfPackages[2].id]);

			const defaultPackage = {
				"discount-percentage": 0,
				"discount-amount": 1,
				"redemptions": 1,
				"package-id": +firstPackage.id,
				"status-id": 2,
				"package-availability-id": 1,
				"isPercentage": 'true'
			};
			packagesFormArray.push(this.fb.group(defaultPackage));

			const secPackage = {
				"discount-percentage": 0,
				"discount-amount": 1,
				"redemptions": 1,
				"package-id": +secondPackage.id,
				"status-id": 2,
				"package-availability-id": 1,
				"isPercentage": 'true'
			};
			packagesFormArray.push(this.fb.group(secPackage));

			const thrPackage = {
				"discount-percentage": 0,
				"discount-amount": 1,
				"redemptions": 1,
				"package-id": +thirdPackage.id,
				"status-id": 2,
				"package-availability-id": 1,
				"isPercentage": 'true'
			};
			packagesFormArray.push(this.fb.group(thrPackage));
		});
	}

	onSelect(ev) {
		this.voucherCodes = [];
		this.selectedVoucherOptions = ev.value;
	}

	onNumberInputChange(ev) {
		if (ev.target.value < 0) {
			ev.target.value = 0;
		}
		return ev;
	}

	onNumberVoucherChange(ev) {
		this.voucherCodes = [];

		ev = this.onNumberInputChange(ev);

		for (let i = 0; i < ev.target.value; i++) {
			this.voucherCodes.push(`${this.genVoucherCode(4, 'A')}${this.genVoucherCode(3, 'N')}`);
		}
	}

	bindHtmlVoucherCode() {
		if (this.voucherCodes.length) {
			let html = '';
			let newColCount = 10;
			this.voucherCodes.forEach ((vc, idx) => {
				if (idx === newColCount) {
					html += '</div>';
				}
				if (idx === 0 || idx === newColCount) {
					if (idx !== 0) {
						newColCount = newColCount + 10;
					}
					html += '<div class="col-4 mt-2">';
				}
				html += `<p class="text-center">${vc}</p>`;
			});
			if (this.voucherCodes.length < newColCount) {
				html += '</div>';
			}

			return html
		} else {
			return '';
		}
	}
}
