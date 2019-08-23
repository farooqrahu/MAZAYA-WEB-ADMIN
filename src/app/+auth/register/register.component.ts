import { Component, OnInit, ViewEncapsulation }	from '@angular/core';
import { HttpClient }														from '@angular/common/http';
import { FormBuilder, FormGroup, Validators }		from '@angular/forms';
import { environment }													from '../../../environments/environment';

import { sortBy } from 'lodash';
import { formatMobileNumber } from "../../utils/formatter";
import { CountriesService } from "../../services/countries/countries.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: 'mazaya-register',
	templateUrl: './register.component.html',
	styleUrls: [ './register.component.scss' ],
	encapsulation: ViewEncapsulation.Emulated
})
export class RegisterComponent implements OnInit {
	corporateForm: FormGroup;
	defaultDialCode = '+966';
	dialCodeNationality: any[] = [];
	dialCodes: any[] = [];
	nationalities: any[] = [];
	resellerForm: FormGroup;
	type = 1;

	constructor (private fb: FormBuilder, private http: HttpClient, private countriesService: CountriesService, private router: Router) {
		this.corporateForm = fb.group({
			name: ['', Validators.compose([ Validators.required ])],
			contactPersonFirstName: ['', Validators.compose([ Validators.required ])],
			contactPersonLastName: ['', Validators.compose([ Validators.required ])],
			emailAddress: ['', Validators.compose([ Validators.required, Validators.email ])],
			phoneNumber: ['', Validators.compose([ Validators.required ])],
			remarks: ['', Validators.compose([ Validators.required ])],
			dialCode: [ '', Validators.compose([]) ],
		});
		this.resellerForm = fb.group({
			name: ['', Validators.compose([ Validators.required ])],
			contactPersonFirstName: ['', Validators.compose([ Validators.required ])],
			contactPersonLastName: ['', Validators.compose([ Validators.required ])],
			emailAddress: ['', Validators.compose([ Validators.required, Validators.email ])],
			phoneNumber: ['', Validators.compose([ Validators.required ])],
			remarks: ['', Validators.compose([ Validators.required ])],
			dialCode: [ '', Validators.compose([]) ],
		});
	}

	ngOnInit () {
		this.getNationalities();
	}

	async getNationalities() {
		this.http.get(`${environment.baseUrl}/nationalities?page[size]=500`).subscribe((response: any) => {
			response.data.forEach(item => {
				this.nationalities.push({
					label: item.attributes[ 'nationality-name' ],
					value: item.attributes[ 'nationality-name' ],
					attributes: item.attributes
				});

				this.dialCodes.push({
					label: item.attributes[ 'dial-code' ],
					value: item.attributes[ 'dial-code' ],
					nationality: item.attributes[ 'nationality-name' ]
				});

				this.dialCodeNationality.push({
					label: `${item.attributes[ 'dial-code' ]} - ${item.attributes[ 'nationality-name' ]}`,
					value: item.attributes[ 'dial-code' ],
					nationality: item.attributes[ 'nationality-name' ]
				});
			});

			// sort alphabetically
			this.nationalities = sortBy(this.nationalities, 'value');
			this.dialCodes = sortBy(this.dialCodes, 'nationality');
			this.dialCodeNationality = sortBy(this.dialCodeNationality, 'nationality');
		});
	}

	validateMobileNumber (form) {
		const dialCode = form.get( 'dialCode' ).value;
		const mobileLength = this.countriesService.getMobileLength( dialCode );
		form.controls['phoneNumber'].setValidators([ Validators.compose([ Validators.minLength(mobileLength), Validators.required ]) ]);
		form.controls['phoneNumber'].updateValueAndValidity();
	}

	formatMobileNumber ( form ) {
		const mobile =  form.get('phoneNumber').value;
		const dialCode = form.get('dialCode').value;

		const formattedMobile = formatMobileNumber( mobile, dialCode );
		form.get('phoneNumber').setValue( formattedMobile );

		this.validateMobileNumber(form);
	}

	onDialCodeChange (value: string): void {
		const form = this.type === 1 ? this.corporateForm : this.resellerForm;
		form.get('dialCode').setValue(value);
		this.formatMobileNumber(form);
	}

	handleChange(evt) {
		this.type = parseInt(evt.target.value);
	}

	register(event) {
		event.preventDefault();

		let isValid = false;
		let data: any;
		if (this.type === 1) {
			this.markFormGroupTouched(this.corporateForm);
			if (this.corporateForm.valid) {
				isValid = true;

				data = {
					data: {
						attributes: {
							'company-name': this.corporateForm.get('name').value,
							'first-name': this.corporateForm.get('contactPersonFirstName').value,
							'last-name': this.corporateForm.get('contactPersonLastName').value,
							'email': this.corporateForm.get('emailAddress').value,
							'company-email': this.corporateForm.get('emailAddress').value,
							'mobile-number': '+966' + this.corporateForm.get('phoneNumber').value,
							'company-phone': '+966' + this.corporateForm.get('phoneNumber').value,
							'remarks': this.corporateForm.get('remarks').value,
							'roleids': ['8'],
						},
						type: 'users',
					},
				};
			}
		} else if (this.type === 2) {
			this.markFormGroupTouched(this.resellerForm);
			if (this.resellerForm.valid) {
				isValid = true;

				data = {
					data: {
						attributes: {
							'company-name': this.resellerForm.get('name').value,
							'first-name': this.resellerForm.get('contactPersonFirstName').value,
							'last-name': this.resellerForm.get('contactPersonLastName').value,
							'email': this.resellerForm.get('emailAddress').value,
							'mobile-number': '+966' + this.resellerForm.get('phoneNumber').value,
							'remarks': this.resellerForm.get('remarks').value,
							'roleids': ['3']
						},
						type: 'users',
					},
				};
			}
		}

		if (isValid) {
			this.http.post(`${environment.baseUrl}/users/for-approval`, data).subscribe((result: any) => {

				alert('Thank you for registering!');
				this.router.navigateByUrl('/auth/login');
				// if (this.type === 1) {
				// 	this.corporateForm.reset();
				// } else {
				// 	this.resellerForm.reset();
				// }
			}, (error) => {
				let msg = '';
				error.error.errors.forEach(error => {
					msg += `${error.title === 'Validation Errors' ? error.detail : error.title}\n`;
				});
				if (msg.includes('DbUpdateException')) {
					alert('Email has already been used')
				} else {
					alert(msg);
				}
			});
		}
	}

	private markFormGroupTouched(formGroup: FormGroup) {
		(Object as any).values(formGroup.controls).forEach(control => {
			control.markAsTouched();
			if (control.controls) {
				this.markFormGroupTouched(control);
			}
		});
	}
}
