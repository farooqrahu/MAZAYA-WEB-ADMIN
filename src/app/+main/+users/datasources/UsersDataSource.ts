import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, finalize } from 'rxjs/operators';
import { JsonApiResponse } from '../../../interfaces/JsonApiResponse';
import { UsersService } from '../../../services/api/users/users.service';
import { find } from 'lodash';

export class UsersDataSource implements DataSource<any> {
  private usersSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public $loading = this.loadingSubject.asObservable();

  constructor(private usersService: UsersService) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.usersSubject.asObservable();
  }

  disconnect() {
    this.usersSubject.complete();
    this.loadingSubject.complete();
  }

  loadUsers(roleFilter: string = 'all', statusFilter: string = 'all', roles: any[] = [],
    filter: string = '', sortBy: string = null, pageIndex: number = 1, pageSize: number = 10) {
    return new Promise((resolve) => {
      this.loadingSubject.next(true);

      let appendUrl: string, params: HttpParams;

      //temporary fix for filtering
      if(roleFilter === 'operators') {
        params = new HttpParams()
        .set('page[size]', pageSize.toString())
        .set('page[number]', (pageIndex + 1).toString());
      } else {
        params = new HttpParams()
        // .set('filter[deleted]', 'ne:true')
        .set('page[size]', pageSize.toString())
        .set('page[number]', (pageIndex + 1).toString());
      }

      if (filter && filter.length > 0) {
        params = params.append('filter[last-name]', `like:${filter}`);
      }

      if (sortBy && sortBy.length > 0) {
        params = params.append('sort', sortBy);
      }

      if (roleFilter !== 'all') {
        appendUrl = `users/${roleFilter}`;
      }

      if (roleFilter === 'consumer') {
        appendUrl = `customers`;
      } else {
        if (roleFilter === 'all') {
          params = params.append('include', 'user-roles');
        }
      }

      if (roleFilter != 'consumer') {
        if (statusFilter === 'deactivated') {
          params = params.append('filter[de-activated]', 'true');
        } else if (statusFilter === 'active') {
          params = params.append('filter[de-activated]', 'false');
        }
      }

      this.usersService.listAll(appendUrl, params).pipe(
        catchError((error) => {
          return of([]);

        }),
        finalize(() => this.loadingSubject.next(false))
      ).subscribe((result: JsonApiResponse) => {
        const users = result.data;
        let includedRoles;

        if (result.included) { // Edge case when no search results are returned
          includedRoles = result.included.filter((included: any) => {
            return included.type === 'user-roles';
          });
        } else {
          includedRoles = [];
        }

        if (roleFilter !== 'all') {
          if (users) {
            users.forEach((user: any) => {
              user.attributes['user-role'] = roleFilter;
            });
          }
        } else {
          if (users) {
            users.forEach((user: any) => {
              const userId = user.id;
              const _role = find(includedRoles, (includedRole: any) => {
                if (includedRole) {
                  return includedRole.relationships.user.data.id === userId;
                } else {
                  return false;
                }
              });
              if (_role) {
                const roleId = _role.relationships.role.data.id;
                const role = find(roles, (savedRole: any) => {
                  return savedRole.id === roleId;
                });
                user.attributes['user-role'] = role.attributes.name;
              }
            });
          }
        }
        if (result && result.meta && result.meta['total-records']) {
          resolve({ count: result.meta['total-records'], users: result.data });
        } else {
          resolve({ count: result.data && result.data.length || 0, users: result.data });
        }
        this.usersSubject.next(users);
      });
    });
  }
}
