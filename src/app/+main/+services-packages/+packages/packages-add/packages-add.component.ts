import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PackagesService } from '../../../../services/api/packages/packages.service';
import { ServicesService } from '../../../../services/api/services/services.service';

@Component({
	           selector: 'mazaya-packages-add',
	           templateUrl: './packages-add.component.html',
	           styleUrls: [ './packages-add.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ PackagesService, ServicesService ]
           })
export class PackagesAddComponent implements OnInit {

	/**
	 * The add package form.
	 */
	createPackageForm: FormGroup;

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

	availableServices: any[];

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
	             private packagesService: PackagesService, private servicesService: ServicesService) {

		this.name = new FormControl('', [ Validators.compose([ Validators.required ]) ]);
		this.name_ar = new FormControl('', [ Validators.compose([ Validators.required ]) ]);
		this.description = new FormControl('', [ Validators.compose([ Validators.required ]) ]);
		this.description_ar = new FormControl('', [ Validators.compose([ Validators.required ]) ]);
		this.description_short = new FormControl('', [ Validators.compose([ Validators.required ]) ]);
		this.description_short_ar = new FormControl('', [ Validators.compose([ Validators.required ]) ]);
		this.individualPrice = new FormControl(0, [ Validators.compose([ Validators.required, Validators.min(1) ]) ]);
		this.familyPrice = new FormControl(0, [ Validators.compose([ Validators.required, Validators.min(1) ]) ]);
		this.additionalPassengerPrice = new FormControl(0,
		                                                [ Validators.compose([ Validators.required, Validators.min(1) ]) ]);
		this.services = new FormControl([], Validators.compose([ Validators.required ]));

		this.createPackageForm = fb.group(
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
	}

	loadAvailableServices () {
		return new Promise((resolve) => {
			this.servicesService.listAll().subscribe((result: any) => {
				this.availableServices = result.data;
				resolve(true);
			});
		});
	}

	createPackage () {
		if(this.createPackageForm.valid){
			let _services = [];
			this.services.value.forEach((__service: any) => {
				_services.push({ id: +__service });
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
						services: _services,
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
					type: 'packages'
				}
			};
			this.packagesService.create(data).subscribe((result: any) => {
				this.router.navigate([ '..' ], { relativeTo: this.activatedRoute });
			}, (error) => {

			});
		}
	}

}
