import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PackagesService } from '../../../../services/api/packages/packages.service';
import { find } from 'lodash';

@Component({
	           selector: 'mazaya-packages-view',
	           templateUrl: './packages-view.component.html',
	           styleUrls: [ './packages-view.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ PackagesService ]
           })
export class PackagesViewComponent implements OnInit {

	packageId: number;
	_package: any;

	packageOnHold: FormControl = new FormControl();
	packageActive: FormControl = new FormControl();

	/**
	 * Constructor.
	 *
	 * @param router
	 * @param activatedRoute
	 * @param packagesService
	 */
	constructor (private router: Router, private activatedRoute: ActivatedRoute,
	             private packagesService: PackagesService) {
		this.packageActive.valueChanges.subscribe((value) => {
			if ( value ) {
				this.packagesService.setPackageActive(this.packageId).subscribe((result) => {

				}, (error) => {
					this.packageActive.setValue(false, { emitEvent: false });
				});
			} else {
				this.packagesService.setPackageInactive(this.packageId).subscribe((result) => {

				}, (error) => {
					this.packageActive.setValue(true, { emitEvent: false });
				});
			}
		});
		this.packageOnHold.valueChanges.subscribe((value) => {
			if ( value ) {
				this.packagesService.setPackageOnHold(this.packageId).subscribe((result) => {

				}, (error) => {
					this.packageOnHold.setValue(false, { emitEvent: false });
				});
			} else {
				this.packagesService.setPackageNotOnHold(this.packageId).subscribe((result) => {

				}, (error) => {
					this.packageOnHold.setValue(true, { emitEvent: false });
				});
			}
		});
	}

	async ngOnInit () {
		this.activatedRoute.params.subscribe(async (params) => {
			if ( params && params[ 'packageId' ] ) {
				this.packageId = +params[ 'packageId' ];
				this._package = Object.assign({}, { en: await this.loadPackageEn() }, { ar: await this.loadPackageAr() });
				this.packageOnHold.setValue(this._package.en[ 'on-hold' ], { emitEvent: false });
				this.packageActive.setValue(this._package.en.active, { emitEvent: false });
			}
		});
	}

	loadPackageEn () {
		return new Promise((resolve) => {
			const include = [ 'membership-packages', 'package-availabilities', 'package-services', 'rating' ];
			this.packagesService.view(this.packageId, null, include, 'en').subscribe((result: any) => {
				resolve(result.data.attributes);
			});
		});
	}

	loadPackageAr () {
		return new Promise((resolve) => {
			this.packagesService.view(this.packageId, null, null, 'ar').subscribe((result: any) => {
				resolve(result.data.attributes);
			});
		});
	}


	deletePackage () {
		const data: any = {
			data: {
				id: this.packageId,
				attributes: {
					deleted: true
				},
				type: 'packages'
			}
		};
		this.packagesService.update(this.packageId, data).subscribe((result: any) => {
			this.router.navigate([ '../..' ], { relativeTo: this.activatedRoute });
		}, (error) => {

		});
	}

	getIndividualPrice () {
		const price = find(this._package.en.availabilities, (availability: any) => availability.name === 'Individual');
		if ( price ) {
			return price.price;
		} else {
			return 0;
		}
	}

	getFamilyPrice () {
		const price = find(this._package.en.availabilities, (availability: any) => availability.name === 'Family');
		if ( price ) {
			return price.price;
		} else {
			return 0;
		}
	}

	getAdditionalMemberPrice () {
		const price = find(this._package.en.availabilities, (availability: any) => availability.name === 'Additional' +
			' Passenger');
		if ( price ) {
			return price.price;
		} else {
			return 0;
		}
	}

}
