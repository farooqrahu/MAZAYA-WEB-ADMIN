import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { environment } from '../../../../environments/environment';
import { RolesService } from '../../../services/api/roles/roles.service';
import { UsersService } from '../../../services/api/users/users.service';
import { assignAttributes } from '../../../utils/json';

@Component({
	           selector: 'mazaya-edit-profile',
	           templateUrl: './change-password.component.html',
	           styleUrls: [ './change-password.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ UsersService ]
           })
export class ChangePasswordComponent implements OnInit {

	userForm: FormGroup;
	oldPassword: FormControl;
	newPassword: FormControl;

	user: any;

	constructor (private router: Router, private roleService: RolesService, private fb: FormBuilder,
	             private http: HttpClient, private activatedRoute: ActivatedRoute, private userService: UsersService,
	             private auth: AuthService) {
		this.oldPassword = new FormControl('', Validators.compose([ Validators.required ]));
		this.newPassword = new FormControl('', Validators.compose([ Validators.required ]));

		this.userForm = fb.group(
			{
				oldPassword: this.oldPassword,
				newPassword: this.newPassword,
			}
		);

	}

	async ngOnInit () {
		await this.loadUser();
	}

	loadUser () {
		return new Promise((resolve) => {
			const userId = +this.auth.getPayload()[ 'user-id' ];
			this.activatedRoute.params.subscribe((params) => {
				if ( userId ) {
					this.userService.viewUser(userId).subscribe((result: any) => {
						this.user = result.data;
						this.user = assignAttributes(this.user, result.included);
						console.log(this.user);
						resolve(true);
					});
				}
			});
		});
	}

	changePassword() {
		this.markFormGroupTouched(this.userForm);

		if (this.userForm.invalid) {
			return;
		}

		const data = {
			"data": {
				"attributes": {
					"old-password": this.userForm.get('oldPassword').value,
					"new-password": this.userForm.get('newPassword').value,
				},
				"type": "users"
			}
		};
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/vnd.api+json',
				'Accept-Language': 'en',
			}),
		};

		this.http.patch(`${environment.baseUrl}/users/${this.user.id}/password`, data, httpOptions).subscribe((result: any) => {
			console.log('result: ', result);
			this.router.navigate([ 'app', 'account', 'profile' ]);
		}, (response) => {
			console.log('error here: ', response);
			let msg = '';
			response.error.errors.forEach(error => {
				msg += `${error.detail}\n`;
			});
			alert(msg);
		});
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
