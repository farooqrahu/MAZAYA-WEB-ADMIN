'use strict';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RefreshTokenService } from '../../services/refresh-token/refresh-token.service';
import { JWTInterceptorService } from '../../services/jwt-interceptor/jwt-interceptor.service';
import { JSONRequestInterceptorService } from '../../services/json-request-interceptor/json-request-interceptor.service';

export const RefreshTokenInterceptor = {
	provide: HTTP_INTERCEPTORS,
	useClass: RefreshTokenService,
	multi: true
};

export const JWTInterceptor = {
	provide: HTTP_INTERCEPTORS,
	useClass: JWTInterceptorService,
	multi: true
};

export const JSONRequestInterceptor = {
	provide: HTTP_INTERCEPTORS,
	useClass: JSONRequestInterceptorService,
	multi: true
};
