import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../../../services/api/services/services.service';

@Component({
	           selector: 'mazaya-services-edit',
	           templateUrl: './services-edit.component.html',
	           styleUrls: [ './services-edit.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ ServicesService ]
           })
export class ServicesEditComponent implements OnInit {

	updateServiceForm: FormGroup;

	name: FormControl;
	name_ar: FormControl;
	description: FormControl;
	description_ar: FormControl;
	is_trackable: FormControl;
	limited: FormControl;

	serviceId: number;

	constructor (private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,
	             private http: HttpClient, private servicesService: ServicesService) {

		this.name = new FormControl('', Validators.compose([ Validators.required ]));
		this.name_ar = new FormControl('', Validators.compose([ Validators.required ]));
		this.description = new FormControl('', Validators.compose([ Validators.required ]));
		this.description_ar = new FormControl('', Validators.compose([ Validators.required ]));
		this.is_trackable = new FormControl(false, Validators.compose([ Validators.required ]));
		this.limited = new FormControl(false, Validators.compose([ Validators.required ]));

		this.updateServiceForm = fb.group(
			{
				name: this.name,
				name_ar: this.name_ar,
				description: this.description,
				description_ar: this.description_ar,
				is_trackable: this.is_trackable,
				limited: this.limited
			}
		);
	}

	async ngOnInit () {
		this.activatedRoute.params.subscribe(async (params) => {
			if ( params && params[ 'serviceId' ] ) {
				this.serviceId = params[ 'serviceId' ];

				let data: any = Object.assign(
					{},
					{ en: await this.loadServiceEn() },
					{ ar: await this.loadServiceAr() }
				);

				this.name.patchValue(data.en.name);
				this.name_ar.patchValue(data.ar.name);
				this.description.patchValue(data.en.description);
				this.description_ar.patchValue(data.ar.description);
				this.is_trackable.patchValue(data.en.trackable);
				this.limited.patchValue(data.en[ 'affect-count' ]);
			}
		});
	}

	loadServiceEn () {
		return new Promise((resolve) => {
			this.servicesService.view(this.serviceId, null, null, 'en').subscribe((result: any) => {
				resolve(result.data.attributes);
			});
		});
	}

	loadServiceAr () {
		return new Promise((resolve) => {
			this.servicesService.view(this.serviceId, null, null, 'ar').subscribe((result: any) => {
				resolve(result.data.attributes);
			});
		});
	}

	updateService () {
		const data = {
			data: {
				attributes: {
					name: this.name.value,
					description: this.description.value,
					dictionary: [
						{
							language: 'ar',
							value: this.name_ar.value,
							'attribute-name': 'name'
						},
						{
							language: 'ar',
							value: this.description_ar.value,
							'attribute-name': 'description'
						}
					]
				},
				type: 'services'
			}
		};
		this.http.patch(`${environment.baseUrl}/services/${this.serviceId}`, data).subscribe((result: any) => {
			this.router.navigate([ '../..' ], { relativeTo: this.activatedRoute });
		});
	}

}
