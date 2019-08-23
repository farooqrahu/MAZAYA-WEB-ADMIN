import { Component, OnInit } from '@angular/core';
import { MyOrderService, OrderService } from 'app/+order/services/order.service';
import { ProgressIndex } from 'app/+order/models/order.model';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { find, startCase, lowerCase } from 'lodash';
import * as _ from 'lodash';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {
  public packages: any = [{
    id: 0,
    text: 'Individual',
    img: 'ic_single.png'
  },
  {
    id: 1,
    text: 'Family',
    img: 'ic_family.png'
  }]
  public progressIndex = ProgressIndex;
  public packages$: Observable<any>;
  public selectedPkg: number;

  constructor(private orderService: OrderService, private myOrderService: MyOrderService) {
    this.myOrderService.setProgressIndex(this.progressIndex.package);
    this.myOrderService.setProgressLine(this.progressIndex.package);

    this.packages$ = this.getPackages;
  }


  public onSelect(pkg: any, index: number): void {
    localStorage.setItem('waSelectedPackageIndex', JSON.stringify(index));

    let pkgArr: any[] = [];
    let fmtPkgArr: any;

    if (pkg.id == 1) {
      pkgArr = [];
      pkgArr.push(pkg);
    } else {
      //get existing pkg
      const existingPkg = JSON.parse(localStorage.getItem('waSelectedPackages')) || null;

      if (existingPkg) {
        pkgArr.push(...existingPkg);
      }

      //remove index 1
      pkgArr = _.filter(pkgArr, function (o) {
        return o.id != 1;
      });
      pkgArr.push(pkg);
    }

    fmtPkgArr = _.uniqWith(pkgArr, _.isEqual);

    localStorage.setItem('waSelectedPackages', JSON.stringify(fmtPkgArr));

    this.myOrderService.setPkg(fmtPkgArr);
  }

  ngOnInit(): void {
  }

  public get getPkgIndexFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem('waSelectedPackageIndex')) || null;
  }

  public getPkgsIndex(index: number): boolean {
    const ret = _.filter(this.getPkgsFromLocalStorage || null, function (o) {
      return o.id == index;
    });

    return ret && ret.length > 0 ? true : false;
  }

  public get getPkgsFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem('waSelectedPackages')) || null;
  }

  public getPkgPrice(pkg: any): any {
    const bookingType = localStorage.getItem('waBookingType') || '';
    return find(pkg.attributes.availabilities, (s: any) => s.name === startCase(bookingType));
  }

  public get getPackages(): Observable<any> {
    let params = new HttpParams();
    params = params.append('filter[web-only]', 'false');

    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.append('Accept-Language', 'en');

    return this.orderService.getPackages(params, httpHeaders).pipe(map(x => x.data));
  }
}
