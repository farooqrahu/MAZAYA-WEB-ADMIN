import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { find, filter } from 'lodash';
import { RolesService } from '../../../services/api/roles/roles.service';
import { UsersService } from '../../../services/api/users/users.service';
import { assignAttributes } from '../../../utils/json';

declare const $: any;

@Component(
	{
		selector: 'mazaya-user-edit',
		templateUrl: './user-edit.component.html',
		styleUrls: [ './user-edit.component.scss' ],
		encapsulation: ViewEncapsulation.Emulated,
		providers: [ UsersService ]
	})
export class UserEditComponent implements OnInit {

	roles: any[] = [];

	invalidPhoneNumberError = false;

	updateInternalUserForm: FormGroup;

	updateUserForm: FormGroup;

	avatarPreview: string;

	selectedRole: any;

	@ViewChild('userAvatarFileInput', {static: false}) userAvatarFileInput: ElementRef;

	first_name_internal: FormControl;
	last_name_internal: FormControl;
	email_internal: FormControl;
	mobile_internal: FormControl;

	first_name: FormControl;
	last_name: FormControl;
	email: FormControl;
	mobile: FormControl;
	passport_scan: FormControl;
	passport_expiry_date: FormControl;
	salutation: FormControl;
	dial_code: FormControl;
	nationality: FormControl;

	nationalities: any[] = [];

	dialCodes: any[] = [];

	user: any;

	isCustomer: boolean = false;

	/**
	 * Constructor
	 * @param router
	 * @param roleService
	 * @param fb
	 * @param http
	 * @param activatedRoute
	 */
	constructor (private router: Router, private roleService: RolesService, private fb: FormBuilder,
	             private http: HttpClient, private activatedRoute: ActivatedRoute, private userService: UsersService) {

		this.first_name_internal = new FormControl('', Validators.compose([ Validators.required ]));
		this.last_name_internal = new FormControl('', Validators.compose([ Validators.required ]));
		this.email_internal = new FormControl('', Validators.compose([ Validators.required, Validators.email ]));
		this.mobile_internal = new FormControl('',
		                                       Validators.compose([ Validators.required, Validators.pattern('[0-9]{9}') ]));

		this.updateInternalUserForm = fb.group(
			{
				first_name: this.first_name_internal,
				last_name: this.last_name_internal,
				email: this.email_internal,
				mobile: this.mobile_internal
			}
		);

		this.first_name = new FormControl('', Validators.compose([ Validators.required ]));
		this.last_name = new FormControl('', Validators.compose([ Validators.required ]));
		this.email = new FormControl('', Validators.compose([ Validators.required, Validators.email ]));
		this.mobile = new FormControl('', Validators.compose([ Validators.required ]));
		this.passport_scan = new FormControl('', Validators.compose([ Validators.required ]));
		this.passport_expiry_date = new FormControl('', Validators.compose([ Validators.required ]));
		this.nationality = new FormControl('', Validators.compose([ Validators.required ]));
		this.dial_code = new FormControl('', Validators.compose([ Validators.required ]));
		this.salutation = new FormControl('', Validators.compose([ Validators.required ]));

		this.updateUserForm = fb.group(
			{
				first_name: this.first_name,
				last_name: this.last_name,
				email: this.email,
				mobile: this.mobile,
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
		await this.loadUser();
		if ( this.isCustomer ) {
			// TODO assign customer role
		} else {
			const roleId = this.user.attributes[ 'user-role' ].relationships.role.data.id;
			if ( roleId ) {
				const role = find(this.roles, (role: any) => role.id === roleId);
				this.user.attributes[ 'user-role' ] = role;
				this.selectRole(role);
				this.updateInternalUserForm.patchValue(this.user.attributes);
				this.updateInternalUserForm.patchValue(
					{
						first_name: this.user.attributes[ 'first-name' ],
						last_name: this.user.attributes[ 'last-name' ],
						mobile: this.user.attributes[ 'mobile-number' ].replace('+966', '')
					});
				this.updateInternalUserForm.updateValueAndValidity();
				if ( this.user.attributes[ 'image-url' ] ) {
					this.avatarPreview = this.user.attributes[ 'image-url' ];
				}
			}
		}
	}

	loadUser () {
		return new Promise((resolve) => {
			this.activatedRoute.params.subscribe((params) => {
				if ( params && params[ 'userId' ] ) {
					if ( params[ 'type' ] ) {
						this.isCustomer = true;
						this.userService.viewCustomer(params[ 'userId' ]).subscribe((result: any) => {
							this.user = result.data;
							this.user = assignAttributes(this.user, result.included);
							resolve(true);
						});
					} else {
						this.isCustomer = false;
						this.userService.viewUser(params[ 'userId' ]).subscribe((result: any) => {
							this.user = result.data;
							this.user = assignAttributes(this.user, result.included);
							this.updateUserForm.patchValue(this.user.attributes);
							resolve(true);
						});
					}
				}
			});

		});
	}

	updateUser () {
		if ( this.isCreateInternalUser() ) {
			if ( this.updateInternalUserForm.valid ) {
				this.doUpdateInternalUser();
			} else {}
		} else {
			if ( this.updateUserForm.valid ) {
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

		});
	}

	private async doUpdateInternalUser () {
		const data = {
			data: {
				attributes: {
					'first-name': this.first_name_internal.value,
					'last-name': this.last_name_internal.value,
					'mobile-number': `+966${this.mobile_internal.value}`,
					'email': this.email_internal.value,
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
		this.http.patch(`${environment.baseUrl}/users/${this.user.id}`, data).subscribe((result: any) => {
			this.router.navigate([ 'app', 'users' ], {
				queryParams: {
					role: this.selectedRole.attributes.name.toLowerCase()
				}
			});
		}, (error) => {
			const actualError: string = error.error.errors[ 0 ].detail;
			if ( actualError.includes('phone number') ) {
				this.invalidPhoneNumberError = true;
			}
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
			this.updateUserForm.get('nationality').setValue(defaultNationality);

			const dialCodes: any[] = [];
			this.nationalities.forEach((nationality: any) => {
				dialCodes.push({ 'dial-code': nationality[ 'dial-code' ], 'nationality': nationality[ 'en-short-name' ] });
			});

			this.dialCodes = dialCodes;

		});
	}

}
