import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as pluralize from 'pluralize';
import { RolesService } from '../../../services/api/roles/roles.service';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { find, filter } from 'lodash';
import { capitalize } from '../../../utils/strings';
import {AuthService} from "ng2-ui-auth";

@Component({
	           selector: 'mazaya-user-add',
	           templateUrl: './user-add.component.html',
	           styleUrls: [ './user-add.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated
           })
export class UserAddComponent implements OnInit {

	roles: any[] = [];
	role: string;

	createInternalUserForm: FormGroup;

	createUserForm: FormGroup;

	avatarPreview: string;

	selectedRole: any;

	invalidPhoneNumberError = false;

	@ViewChild('userAvatarFileInput', {static: false}) userAvatarFileInput: ElementRef;

	company_name_internal: FormControl;
	first_name_internal: FormControl;
	last_name_internal: FormControl;
	email_internal: FormControl;
	mobile_internal: FormControl;
	password_internal: FormControl;

	first_name: FormControl;
	last_name: FormControl;
	email: FormControl;
	mobile: FormControl;
	password: FormControl;
	passport_scan: FormControl;
	passport_expiry_date: FormControl;
	salutation: FormControl;
	dial_code: FormControl;
	nationality: FormControl;

	nationalities: any[] = [];

	dialCodes: any[] = [];

	/**
	 * Constructor
	 * @param router
	 * @param roleService
	 * @param fb
	 * @param http
	 */
	constructor (private router: Router, private roleService: RolesService, private fb: FormBuilder,
	             private http: HttpClient, private auth: AuthService) {
		const payload = this.auth.getPayload();
		this.role = (<string>payload[ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' ]).toLowerCase();
		console.log('role: ', this.role);

		this.company_name_internal = new FormControl('');
		this.first_name_internal = new FormControl('', Validators.compose([ Validators.required ]));
		this.last_name_internal = new FormControl('', Validators.compose([ Validators.required ]));
		this.email_internal = new FormControl('', Validators.compose([ Validators.required, Validators.email ]));
		this.mobile_internal = new FormControl('', Validators.compose(
			[ Validators.required ])); //, Validators.pattern('[0-10]{10}')
		this.password_internal = new FormControl('', Validators.compose([ Validators.required, Validators.pattern(
			'^(?=.*[\\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\\w!@#$%^&*]{8,}$') ]));

		this.createInternalUserForm = fb.group(
			{
				company_name: this.company_name_internal,
				first_name: this.first_name_internal,
				last_name: this.last_name_internal,
				email: this.email_internal,
				mobile: this.mobile_internal,
				password: this.password_internal
			}
		);

		this.first_name = new FormControl('', Validators.compose([ Validators.required ]));
		this.last_name = new FormControl('', Validators.compose([ Validators.required ]));
		this.email = new FormControl('', Validators.compose([ Validators.required, Validators.email ]));
		this.password = new FormControl('', Validators.compose([ Validators.required ]));
		this.mobile = new FormControl('', Validators.compose([ Validators.required ]));
		this.password = new FormControl('', Validators.compose([ Validators.required ]));
		this.passport_scan = new FormControl('', Validators.compose([ Validators.required ]));
		this.passport_expiry_date = new FormControl('', Validators.compose([ Validators.required ]));
		this.nationality = new FormControl('', Validators.compose([ Validators.required ]));
		this.dial_code = new FormControl('', Validators.compose([ Validators.required ]));
		this.salutation = new FormControl('', Validators.compose([ Validators.required ]));

		this.createUserForm = fb.group(
			{
				first_name: this.first_name,
				last_name: this.last_name,
				email: this.email,
				mobile: this.mobile,
				password: this.password,
				passport_scan: this.passport_scan,
				passport_expiry_data: this.passport_expiry_date,
				nationality: this.nationality,
				dial_code: this.dial_code,
				salutation: this.salutation
			}
		);
	}

	/**
	 * Initialize the form and form controls.
	 */
	async ngOnInit () {
		const roles = await this.roleService.loadRoles();
		this.roles = filter(roles, (role: any) => {
			return role.attributes.name.toLowerCase() !== 'consumer';
		});
		this.loadNationalities();
	}

	createUser () {
		console.log('createUser');
		if (this.selectedRole.id === '3' || this.selectedRole.id === '8') {
			this.createUserForm.get('password').clearValidators();
			this.createUserForm.get('password').updateValueAndValidity();
			this.createInternalUserForm.get('password').clearValidators();
			this.createInternalUserForm.get('password').updateValueAndValidity();
		}
		if ( this.isCreateInternalUser() ) {
			if ( this.createInternalUserForm.valid ) {
				this.doCreateInternalUser();
			} else {
				this.createInternalUserForm.get('first_name').markAsTouched();
				this.createInternalUserForm.get('last_name').markAsTouched();
				this.createInternalUserForm.get('email').markAsTouched();
				this.createInternalUserForm.get('mobile').markAsTouched();
				this.createInternalUserForm.get('password').markAsTouched();
			}
		} else {
			if ( this.createUserForm.valid ) {
				this.doCreateUser();
			} else {

			}
		}
	}

	private doCreateUser () {
		const data = {
			data: {
				attributes: {
					'first-name': this.first_name_internal.value,
					'last-name': this.last_name_internal.value,
					'mobile-number': `+966${this.mobile_internal.value}`,
					'email': this.email_internal.value,
					'password': this.password_internal.value,
					'roleids': [
						this.selectedRole.id
					]
				},
				type: 'users'
			}
		};

		this.http.post(`${environment.baseUrl}/users`, data).subscribe((result: any) => {
			this.router.navigate([ 'app', 'users' ]);
		}, (error) => {
			console.log('error here');
			let msg = '';
			error.errors.forEach(error => {
				msg += `${error.title}\n`;
			})
			alert(msg);
		});
	}

	private async doCreateInternalUser () {
		const data = {
			data: {
				attributes: {
					'first-name': this.first_name_internal.value,
					'last-name': this.last_name_internal.value,
					'mobile-number': `+966${this.mobile_internal.value}`,
					'email': this.email_internal.value,
					'password': this.password_internal.value,
					'roleids': [
						this.selectedRole.id
					]
				},
				type: 'users'
			}
		};

		if (this.selectedRole.id === '3' || this.selectedRole.id === '8') {
			if (!this.company_name_internal.value) {
				alert(`${this.selectedRole.id === '3' ? 'Reseller' : 'Corporate'} name is required`);
				return;
			}
			if (this.selectedRole.id === '8') {
				data.data.attributes['company-name'] = this.company_name_internal.value;
				data.data.attributes['company-email'] = this.email_internal.value;
				data.data.attributes['company-phone'] = `+966${this.mobile_internal.value}`;
				data.data.attributes['remarks'] = '';
			} else {
				data.data.attributes['company-name'] = this.company_name_internal.value;
				data.data.attributes['remarks'] = '';
			}
			delete data.data.attributes.password;

			this.http.post(`${environment.baseUrl}/users/for-approval`, data).subscribe((result: any) => {
				if (this.role === 'admin') {
					console.log('result: ', result);
					const data = {
						data: {
							attributes: {
								'is-approved': true,
							},
							type: 'users'
						}
					};
					const userId = result.data.id;

					this.http.put(`${environment.baseUrl}/users/${userId}/approval`, data)
						.subscribe((result) => {
							this.router.navigate([ 'app', 'users' ]);
						});
				} else {
					this.router.navigate([ 'app', 'users' ]);
				}
			}, (error) => {
				let msg = '';
				error.error.errors.forEach(error => {
					msg += `${error.title}\n`;
				});
				alert(msg);
			});
		} else {
			const el = this.userAvatarFileInput.nativeElement;
			if ( el.files && el.files[ 0 ] ) {
				data.data.attributes[ 'image-url' ] = await this.uploadInternalAvatar();
			}
			this.invalidPhoneNumberError = false;
			this.http.post(`${environment.baseUrl}/users`, data).subscribe((result: any) => {
				this.router.navigate([ 'app', 'users' ], {
					queryParams: {
						role: this.selectedRole.attributes.name.toLowerCase()
					}
				});
			}, (response) => {
				const actualError: string = response.error.errors[ 0 ].detail;
				if ( actualError && actualError.includes('phone number') ) {
					this.invalidPhoneNumberError = true;
				}

				console.log('error here: ', response);
				let msg = '';
				response.error.errors.forEach(err => {
					msg += `${err.title}\n`;
				})
				alert(msg);
			});
		}
	}

	private uploadInternalAvatar () {
		return new Promise((resolve) => {
			const el = this.userAvatarFileInput.nativeElement;
			const file = el.files[ 0 ];
			if ( file ) {
				const formData = new FormData();
				formData.append('file', file);
				formData.append('filename', this.email_internal.value + '-avatar-' + file.name);
				formData.append('image_type', 'avatar');

				this.http.post(`${environment.baseUrl}/images/upload`, formData).subscribe((result: any) => {
					resolve(result.url);
				});
			} else {
				resolve('');
			}
		});
	}

	private uploadCustomerAvatar () {
		return new Promise((resolve) => {
			const el = this.userAvatarFileInput.nativeElement;
			const file = el.files[ 0 ];
			const formData = new FormData();
			formData.append('file', file);
			formData.append('file-name', this.email.value + '-avatar-' + file.name);
			formData.append('image-type', 'avatar');

			this.http.post(`${environment.baseUrl}/images/upload`, formData).subscribe((result: any) => {
				resolve(result.url);
			});
		});
	}

	loadAvatarForPreview () {
		const el = this.userAvatarFileInput.nativeElement;
		const file = el.files[ 0 ];
		const reader = new FileReader();

		reader.onload = (e: any) => {
			this.avatarPreview = e.target.result;
		};

		reader.readAsDataURL(file);
	}

	isRoleSelected () {
		return this.selectedRole;
	}

	isSelectedRole (role) {
		return role === this.selectedRole;
	}

	selectRole (role) {
		console.log('role: ', role);
		this.selectedRole = role;
	}

	formatRoleName (str: string) {
		if ( str !== 'all' ) {
			return pluralize.plural(capitalize(str));
		} else {
			return capitalize(str);
		}
	}

	isCreateInternalUser () {
		return this.isRoleSelected() && this.selectedRole.attributes.name.toLowerCase() !== 'consumer';
	}

	loadNationalities (): void {
		this.http.get(`${environment.baseUrl}/nationalities?page[size]=500&sort=en-short-name`).subscribe((res: any) => {
			res = res.data;
			res.forEach(entry => {
				entry = entry.attributes;
				this.nationalities.push(entry);
			});
			const defaultNationality = find(this.nationalities, (nation: any) => {
				return nation[ 'alpha-3-code' ] === 'SAU';
			});
			this.createUserForm.get('nationality').setValue(defaultNationality);

			const dialCodes: any[] = [];
			this.nationalities.forEach((nationality: any) => {
				dialCodes.push({ 'dial-code': nationality[ 'dial-code' ], 'nationality': nationality[ 'en-short-name' ] });
			});

			this.dialCodes = dialCodes;

		});
	}

}
