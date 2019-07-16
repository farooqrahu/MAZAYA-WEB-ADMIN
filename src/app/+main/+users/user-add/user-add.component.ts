import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as pluralize from 'pluralize';
import { RolesService } from '../../../services/api/roles/roles.service';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { find, filter } from 'lodash';
import { capitalize } from '../../../utils/strings';

@Component({
	           selector: 'mazaya-user-add',
	           templateUrl: './user-add.component.html',
	           styleUrls: [ './user-add.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated
           })
export class UserAddComponent implements OnInit {

	roles: any[] = [];

	createInternalUserForm: FormGroup;

	createUserForm: FormGroup;

	avatarPreview: string;

	selectedRole: any;

	invalidPhoneNumberError = false;

	@ViewChild('userAvatarFileInput', {static: false}) userAvatarFileInput: ElementRef;

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
	             private http: HttpClient) {

		this.first_name_internal = new FormControl('', Validators.compose([ Validators.required ]));
		this.last_name_internal = new FormControl('', Validators.compose([ Validators.required ]));
		this.email_internal = new FormControl('', Validators.compose([ Validators.required, Validators.email ]));
		this.mobile_internal = new FormControl('', Validators.compose(
			[ Validators.required ])); //, Validators.pattern('[0-10]{10}')
		this.password_internal = new FormControl('', Validators.compose([ Validators.required, Validators.pattern(
			'^(?=.*[\\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\\w!@#$%^&*]{8,}$') ]));

		this.createInternalUserForm = fb.group(
			{
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
