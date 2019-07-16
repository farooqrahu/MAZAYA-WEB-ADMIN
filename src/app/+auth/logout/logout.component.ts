import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { Router } from '@angular/router';

@Component(
	{
		selector: 'mazaya-logout',
		templateUrl: './logout.component.html',
		styleUrls: [ './logout.component.scss' ],
		encapsulation: ViewEncapsulation.Emulated
	})
export class LogoutComponent {

	constructor (private auth: AuthService, private router: Router) {
		auth.logout().subscribe(() => {
			//noinspection JSIgnoredPromiseFromCall
			router.navigateByUrl('/auth/login');
		});
	}

}
