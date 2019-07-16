import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';

@Injectable()
export class ApiService {

  /**
   * Will hold an array of objects.
   *
   * @type {any}
   */
  data: any = {};

  /**
   * Will hold single object.
   *
   * @type {any}
   */
  single: any = {};

  /**
   * Constructor.
   * @param httpClient
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * Action depends on the given method, and
   * the resource is based on the given name.
   *
   * @param method
   *  GET/POST/PUT/etc..
   * @param name
   *  The name of the resource
   * @param params
   *  Other options for the API call
   */
  resource(method, name, params = {}) {
    let payload = null;

    return new Promise((resolve, reject) => {
      if (method === 'get') {
        payload = { params };
      }
      else {
        payload = params;
      }

      this
        .httpClient[method](`${environment.baseUrl}/${name}`, payload)
        .subscribe(
          (data: any) => {
            this.data[name] = data;
            resolve(data);
          },
          (err: any) => {
            reject(err);
          }
        );
    });
  }

}
