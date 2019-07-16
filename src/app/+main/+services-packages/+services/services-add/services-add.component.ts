import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
	           selector: 'mazaya-services-add',
	           templateUrl: './services-add.component.html',
	           styleUrls: [ './services-add.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated
           })
export class ServicesAddComponent implements OnInit {

	createServiceForm: FormGroup;

	name: FormControl;
	name_ar: FormControl;
	description: FormControl;
	description_ar: FormControl;
	is_trackable: FormControl;
	limited: FormControl;

	constructor (private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,
	             private http: HttpClient) {

		this.name = new FormControl('', Validators.compose([ Validators.required ]));
		this.name_ar = new FormControl('', Validators.compose([ Validators.required ]));
		this.description = new FormControl('', Validators.compose([ Validators.required ]));
		this.description_ar = new FormControl('', Validators.compose([ Validators.required ]));
		this.is_trackable = new FormControl(false, Validators.compose([ Validators.required ]));
		this.limited = new FormControl(false, Validators.compose([ Validators.required ]));

		this.createServiceForm = fb.group(
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

	ngOnInit () {
	}

	createService () {
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
		this.http.post(`${environment.baseUrl}/services`, data).subscribe((result: any) => {
			this.router.navigate([ '..' ], { relativeTo: this.activatedRoute });
		});
	}

}
