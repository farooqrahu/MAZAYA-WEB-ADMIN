import { Injectable, Injector } from '@angular/core';
import {
	HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { AuthService } from 'ng2-ui-auth';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';
import { IRefreshTokenRequest } from '../../interfaces/requests/refresh-token-request';
import { IRefreshTokenResponse } from '../../interfaces/responses/refresh-token-response';
import { TokenService } from '../token/token.service';
import { unAuthorizedRequests } from '../../shared/config/unauthorizedRequests';

@Injectable()
export class RefreshTokenService implements HttpInterceptor {

	private authService: AuthService;
	private http: HttpClient;
	private tokenService: TokenService;

	constructor (inject: Injector) {
		this.authService = inject.get(AuthService);
		this.http = inject.get(HttpClient);
	}

	private isTokenExpired (): boolean {
		if ( this.authService.getPayload() ) {
			const exp = this.authService.getPayload().exp;
			return moment(exp).isBefore(moment(), 'm');
		} else {
			return true;
		}
	}

	intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const isUnauthorizedRequest = req.url.match(unAuthorizedRequests.join('|'));
		const hasToken = this.authService.getToken()
			&& this.authService.getToken() !== null
			&& typeof this.authService.getToken() !== 'undefined';
		const needsRefresh = !this.authService.isAuthenticated() || this.isTokenExpired();
		if ( hasToken && !isUnauthorizedRequest && needsRefresh ) {
			const requestBody: IRefreshTokenRequest = {
				grant_type: 'refresh_token',
				refresh_token: this.tokenService.getRefreshToken()
			};
			this.http.post<IRefreshTokenResponse>(`${environment.baseUrl}/auth/token`, requestBody).subscribe(
				(result: IRefreshTokenResponse) => {
					this.tokenService.setToken(result.token);
					this.tokenService.setRefreshToken(result.refresh_token);
					return next.handle(req);
				},
				(error: HttpErrorResponse) => {
					// TODO the user is logged out and token cannot be refreshed
					// TODO redirect to login page with error message
				});
		} else {
			return next.handle(req);
		}
	}

}
