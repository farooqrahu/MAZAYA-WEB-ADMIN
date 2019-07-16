import { Injectable } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JWTInterceptorService implements HttpInterceptor {
	constructor (private auth: AuthService) {}

	intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req.clone(
			{
				setHeaders: {
					Authorization: `Bearer ${this.auth.getToken()}`
				}
			}));
	}
}
