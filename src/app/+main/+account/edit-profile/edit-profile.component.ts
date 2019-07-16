import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { environment } from '../../../../environments/environment';
import { RolesService } from '../../../services/api/roles/roles.service';
import { UsersService } from '../../../services/api/users/users.service';
import { assignAttributes } from '../../../utils/json';

@Component({
	           selector: 'mazaya-edit-profile',
	           templateUrl: './edit-profile.component.html',
	           styleUrls: [ './edit-profile.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ UsersService ]
           })
export class EditProfileComponent implements OnInit {

	updateInternalUserForm: FormGroup;

	user: any;

	avatarPreview: string;

	@ViewChild('userAvatarFileInput', {static: false}) userAvatarFileInput: ElementRef;

	first_name_internal: FormControl;
	last_name_internal: FormControl;
	email_internal: FormControl;
	mobile_internal: FormControl;

	constructor (private router: Router, private roleService: RolesService, private fb: FormBuilder,
	             private http: HttpClient, private activatedRoute: ActivatedRoute, private userService: UsersService,
	             private auth: AuthService) {
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

	}

	async ngOnInit () {
		await this.loadUser();
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

	loadUser () {
		return new Promise((resolve) => {
			const userId = +this.auth.getPayload()[ 'user-id' ];
			this.activatedRoute.params.subscribe((params) => {
				if ( userId ) {
					this.userService.viewUser(userId).subscribe((result: any) => {
						this.user = result.data;
						this.user = assignAttributes(this.user, result.included);
						this.updateInternalUserForm.patchValue(this.user.attributes);
						resolve(true);
					});
				}
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

	async updateUser () {
		const data = {
			data: {
				attributes: {
					'first-name': this.first_name_internal.value,
					'last-name': this.last_name_internal.value,
					'mobile-number': `+966${this.mobile_internal.value}`,
					'email': this.email_internal.value
				},
				type: 'users'
			}
		};
		const el = this.userAvatarFileInput.nativeElement;
		if ( el.files && el.files[ 0 ] ) {
			data.data.attributes[ 'image-url' ] = await this.uploadInternalAvatar();
		}
		this.http.patch(`${environment.baseUrl}/users/${this.user.id}`, data).subscribe((result: any) => {
			this.router.navigate([ 'app', 'account', 'profile' ]);
		}, (error) => {

		});
	}

}
