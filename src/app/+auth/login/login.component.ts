import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component(
	{
		selector: 'mazaya-login',
		templateUrl: './login.component.html',
		styleUrls: [ './login.component.scss' ],
		encapsulation: ViewEncapsulation.Emulated
	})
export class LoginComponent implements OnInit {

	showInvalidCredentialsError = false;
	showLoginFormError = false;

	loginForm: FormGroup;

	constructor (private fb: FormBuilder, private authService: AuthService, private router: Router) {
		this.loginForm = fb.group(
			{
				email: [ '', Validators.compose([ Validators.required, Validators.email ]) ],
				password: [ '', Validators.compose([ Validators.required ]) ]
			});

		this.loginForm.valueChanges.subscribe(() => {
			this.showLoginFormError = false;
			this.showInvalidCredentialsError = false;
		});
	}

	ngOnInit () {

	}

	login () {
		if ( this.loginForm.valid ) {
			const user = {
				email: this.loginForm.get('email').value,
				password: this.loginForm.get('password').value,
				client_id: 1,
				client_secret: 'SuperSecretKeyOfmyDeviceNotFinalStillNeedsDiscussion'
			};
			this.authService.login(user).subscribe(
				{
					error: (err: any) => {
						this.showInvalidCredentialsError = true;
						this.showLoginFormError = false;
						return false;
					},
					complete: () => {
						this.showInvalidCredentialsError = false;
						this.showLoginFormError = false;
						//noinspection JSIgnoredPromiseFromCall
						this.router.navigateByUrl('app/dashboard');
						return true;
					}
				});
		} else {
			this.loginForm.get('email').markAsTouched();
			this.loginForm.get('password').markAsTouched();
			this.showLoginFormError = true;
			this.showInvalidCredentialsError = false;
		}
	}

}
