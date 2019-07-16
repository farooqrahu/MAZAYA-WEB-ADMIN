import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../services/api/api.service';
import * as _ from 'lodash';

@Injectable()
export class IsPackageIdExistsGuard implements CanActivate {

  /**
   * Constructor.
   * @param api
   */
  constructor(private api: ApiService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let packageId = next.params.id;

    if (!this.api.data.hasOwnProperty('packages')) {
      return this.getPackages(packageId);
    }

    let packages = this.api.data['packages'];
    let found = _.find(packages.data, { id: packageId });

    if (found) {
      this.api.single['packages'] = found;
      return true;
    }
    else {
      return this.getPackages(packageId);
    }
  }

  /**
   * Get the package based on the given ID.
   *
   * @param packageId
   */
  getPackages(packageId) {
    let result = this.api.resource('get', `packages/${packageId}`, {});

    return result.then(
      (data: any) => {
        this.api.single['packages'] = data.data;
        return true;
      },
      (err: any) => {
        this.router.navigate(['/app/services-packages']);
        return false;
      }
    );
  }
}
