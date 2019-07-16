import { Injectable } from '@angular/core';
import { EntityService } from '../entity/entity.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class VouchersService extends EntityService {

  entityUrl = 'vouchers';

  public createVoucher(data: any) {
    return this.http.post(`${environment.baseUrl}/vouchers/multiple`, data);
  }

  public getVouchers(pageVars: any, text: string = ''): Observable<any> {
    return this.http.get(`${environment.baseUrl}/vouchers?filter[deleted]=ne:true&include=voucher-packages,voucher-packages.status&page[size]=${pageVars.pageSize}&page[number]=${pageVars.pageIndex}&sort=-create-date-time-utc${text ? '&filter[code]=like:' + text : ''}`);
  }       

  public editVoucher(id: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}/vouchers/${id}?include=voucher-packages`);
  }

  public updateVoucher(payload: any, id: number) {
    return this.http.patch(`${environment.baseUrl}/vouchers/${id}`, payload);
  }

  public deleteVoucher(id: number) {
    return this.http.delete(`${environment.baseUrl}/vouchers/${id}`);
  }
}
