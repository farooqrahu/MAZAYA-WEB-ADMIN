import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../services/api/api.service';
import * as _ from 'lodash';

@Injectable()
export class IsUseridExistsGuard implements CanActivate {

  /**
   * Constructor.
   *
   * @param api
   * @param router
   */
  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  /**
   * Can Activate the path.
   * @param next
   * @param state
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let users = this.api.data['users'];
    let found = _.find(users, { id: parseInt(next.params.id) });

    // If user id is already present, we don't need to call API
    if (found) {
      this.api.single['users'] = found;
      return true;
    }
    else {
      const result = this.api.resource('get', `users/${next.params.id}`, {});

      return result.then(
        (data: any) => {
          this.api.single['users'] = data.data;
          return true;
        },
        (err: any) => {
          this.router.navigate(['/app/users']);
          return false;
        }
      );
    }
  }
}
