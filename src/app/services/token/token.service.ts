import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { LocalStorage } from 'ngx-store';

@Injectable()
export class TokenService implements OnDestroy {

	@LocalStorage('r_t') private refreshToken: string = null;

	constructor (private auth: AuthService) {}

	getRefreshToken (): string {
		return this.refreshToken;
	}

	setRefreshToken (token: string): void {
		this.refreshToken = token;
	}

	setToken (token: string): void {
		this.auth.setToken(token);
	}

	ngOnDestroy () {}

}
