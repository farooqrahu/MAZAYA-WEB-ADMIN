import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JSONRequestInterceptorService implements HttpInterceptor {
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers: { [headerName: string]: string };

    if ( !req.headers.has('Content-Type') ) {
      if (req.url.search('auth/token') > -1) {
        headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.api+json'
        };
      }
      else if ( req.url.includes('images') ) {
	      headers = {
		      'Accept': 'application/vnd.api+json'
	      };
      }
      else {
        headers = {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        };
      }

      return next.handle(req.clone({ setHeaders: headers }));
    }
    else {
      return next.handle(req);
    }
  }
}
