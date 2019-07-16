import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PackagesService } from '../../../../services/api/packages/packages.service';
import { find } from 'lodash';
import { ServicesService } from '../../../../services/api/services/services.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
	           selector: 'mazaya-packages-edit',
	           templateUrl: './packages-edit.component.html',
	           styleUrls: [ './packages-edit.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ PackagesService, ServicesService ]
           })
export class PackagesEditComponent implements OnInit {

	/**
	 * The add package form.
	 */
	editPackageForm: FormGroup;

	name: FormControl;
	name_ar: FormControl;
	description: FormControl;
	description_ar: FormControl;
	description_short: FormControl;
	description_short_ar: FormControl;
	individualPrice: FormControl;
	familyPrice: FormControl;
	additionalPassengerPrice: FormControl;
	services: FormControl;

	packageId: number;

	_package: any;

	availableServices: any[] = [];

	servicesRelationshipLink: string;

	/**
	 * Constructor.
	 *
	 * @param router
	 * @param fb
	 * @param activatedRoute
	 * @param packagesService
	 * @param servicesService
	 */
	constructor (private router: Router, private fb: FormBuilder, private activatedRoute: ActivatedRoute,
	             private packagesService: PackagesService, private servicesService: ServicesService,
	             private http: HttpClient) {

		this.name = new FormControl('', [ Validators.compose([ Validators.required ]) ]);
		this.name_ar = new FormControl('', [ Validators.compose([ Validators.required ]) ]);
		this.description = new FormControl('', [ Validators.compose([ Validators.required ]) ]);
		this.description_ar = new FormControl('', [ Validators.compose([ Validators.required ]) ]);
		this.description_short = new FormControl('', [ Validators.compose([ Validators.required ]) ]);
		this.description_short_ar = new FormControl('', [ Validators.compose([ Validators.required ]) ]);
		this.individualPrice = new FormControl('', [ Validators.compose([ Validators.required, Validators.min(1) ]) ]);
		this.familyPrice = new FormControl('', [ Validators.compose([ Validators.required, Validators.min(1) ]) ]);
		this.additionalPassengerPrice = new FormControl('',
		                                                [ Validators.compose([ Validators.required, Validators.min(1) ]) ]);
		this.services = new FormControl([], Validators.compose([ Validators.required ]));

		this.editPackageForm = fb.group(
			{
				name: this.name,
				name_ar: this.name_ar,
				description: this.description,
				description_ar: this.description_ar,
				description_short: this.description_short,
				description_short_ar: this.description_short_ar,
				individualPrice: this.individualPrice,
				familyPrice: this.familyPrice,
				additionalPassengerPrice: this.additionalPassengerPrice,
				services: this.services
			}
		);
	}

	async ngOnInit () {
		await this.loadAvailableServices();
		this.activatedRoute.params.subscribe(async (params) => {
			if ( params && params[ 'packageId' ] ) {
				this.packageId = +params[ 'packageId' ];
				this._package = Object.assign({}, { en: await this.loadPackageEn() }, { ar: await this.loadPackageAr() });

				this.name.patchValue(this._package.en.name);
				this.name_ar.patchValue(this._package.ar.name);

				this.description.patchValue(this._package.en.description);
				this.description_ar.patchValue(this._package.ar.description);

				this.description_short.patchValue(this._package.en[ 'short-description' ]);
				this.description_short_ar.patchValue(this._package.ar[ 'short-description' ]);

				this.individualPrice.patchValue(this.getIndividualPrice());
				this.familyPrice.patchValue(this.getFamilyPrice());
				this.additionalPassengerPrice.patchValue(this.getAdditionalMemberPrice());

				const services = [];

				this._package.en.services.forEach((service: any) => {
					services.push(service.id.toString());
				});

				this.services.patchValue(services);
			}
		});

	}

	loadAvailableServices () {
		return new Promise((resolve) => {
			this.servicesService.listAll().subscribe((result: any) => {
				this.availableServices = result.data;
				resolve(true);
			});
		});
	}

	loadPackageEn () {
		return new Promise((resolve) => {
			const include = [ 'membership-packages', 'package-availabilities', 'package-services', 'rating' ];
			this.packagesService.view(this.packageId, null, include, 'en').subscribe((result: any) => {
				this.servicesRelationshipLink = result.data.relationships[ 'package-services' ].links.self;
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

	async updatePackage () {
		const servicesData: any = { data: [] };
		this.services.value.forEach((service) => {
			servicesData.data.push({ type: 'package-services', id: service });
		});
		const data: any = {
			data: {
				attributes: {
					name: this.name.value,
					description: this.description.value,
					'short-description': this.description_short.value,
					dictionary: [
						{
							'language': 'ar',
							'value': this.name_ar.value,
							'attribute-name': 'name'
						},
						{
							'language': 'ar',
							'value': this.description_ar.value,
							'attribute-name': 'description'
						},
						{
							'language': 'ar',
							'value': this.description_short_ar.value,
							'attribute-name': 'short-description'
						}
					],
					availabilities: [
						{
							id: 1,
							price: this.individualPrice.value
						},
						{
							id: 2,
							price: this.familyPrice.value
						},
						{
							id: 3,
							price: this.additionalPassengerPrice.value
						}
					]
				},
				type: 'packages',
				relationships: {
					'package-services': servicesData
				}
			}
		};

		await this.syncServices();

		this.packagesService.update(this.packageId, data).subscribe((result: any) => {
			this.router.navigate([ '../..' ], { relativeTo: this.activatedRoute });
		}, (error) => {

		});
	}

	syncServices () {
		return new Promise((resolve) => {
			const data: any = { data: [] };
			this.services.value.forEach((service) => {
				data.data.push({ type: 'package-services', id: service });
			});
			this.http.patch(this.servicesRelationshipLink, data).subscribe((result: any) => {
				resolve(true);
			});
		});
	}

}
