import { Injectable } from '@angular/core';
import { EntityService } from '../entity/entity.service';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.qa';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class PackagesService extends EntityService {

  public getServices(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Accept-Language', 'en');
    return this.http.get(`${environment.baseUrl}/packages`, { headers: headers });
  }

  entityUrl = 'packages';

  setPackageActive(packageId: number) {
    const data = {
      data: {
        attributes: {
          active: true
        },
        id: packageId,
        type: 'packages'
      }
    };
    return this.update(packageId, data);
  }

  setPackageInactive(packageId: number) {
    const data = {
      data: {
        attributes: {
          active: false
        },
        id: packageId,
        type: 'packages'
      }
    };
    return this.update(packageId, data);
  }

  setPackageOnHold(packageId: number) {
    const data = {
      data: {
        attributes: {
          'on-hold': true
        },
        id: packageId,
        type: 'packages'
      }
    };
    return this.update(packageId, data);
  }

  setPackageNotOnHold(packageId: number) {
    const data = {
      data: {
        attributes: {
          'on-hold': false
        },
        id: packageId,
        type: 'packages'
      }
    };
    return this.update(packageId, data);
  }
}
