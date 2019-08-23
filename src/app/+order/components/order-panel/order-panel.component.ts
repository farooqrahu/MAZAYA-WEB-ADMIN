import { Component, OnInit, Input, Output } from '@angular/core';
import { MyOrder } from 'app/+order/models/order.model';
import { find, startCase, lowerCase } from 'lodash';
import { MyOrderService, OrderService } from 'app/+order/services/order.service';
import { Observable, of } from 'rxjs';
import { AuthService } from 'ng2-ui-auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ResellerDialogComponent } from '../reseller-dialog/reseller-dialog.component';

@Component({
  selector: 'app-order-panel',
  templateUrl: './order-panel.component.html',
  styleUrls: ['./order-panel.component.scss']
})
export class OrderPanelComponent implements OnInit {
  private subTotalDivider: number = 1.05;
  private totalMultiplier: number = 0.05;

  public isSubmit: boolean = true;

  constructor(public dialog: MatDialog, private auth: AuthService, private route: Router, private orderService: OrderService,
    private myOrderService: MyOrderService) { }

  ngOnInit(): void {
    this.myOrderService.totalAmount$.subscribe(amount => {
      localStorage.setItem('waTotal', JSON.stringify(amount));
    })
  }

  public onSubmit(): void {
    const userId = +this.auth.getPayload()['user-id'];
    this.orderService.getUserAgreement(userId).pipe(map(x => x.data)).subscribe(res => {
      if (res && res.length > 0) {
        this.myOrderService.setPaymentOption(true);
      } else {
        //show modal when no agreements
        this.showDialog();
      }
    })
  }

  public showDialog(): void {
    const dialogRef = this.dialog.open(ResellerDialogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => { });

  }

  public get getAddress(): any {
    return JSON.parse(localStorage.getItem('waAddress')) || null;
  }

  public get getPassengers(): any {
    return JSON.parse(localStorage.getItem('waPassengers')) || null;
  }

  public get getFlight(): any {
    return JSON.parse(localStorage.getItem('waSelectedFlight')) || null;
  }

  public get getPkgs(): any {
    return JSON.parse(localStorage.getItem('waSelectedPackages')) || null;
  }

  public flightDateLong(date: any) {
    return this.localToUtc(new Date(date))
  }

  public isPkgMazaya(): any {
    return this.getPkgs && this.getPkgs[0].id == 1 ? true : false;
  }

  private localToUtc(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
  }

  public getPkgPrice(pkg: any): any {
    const bookingType = localStorage.getItem('waBookingType') || null;

    return pkg ? find(pkg.attributes.availabilities, (s: any) => s.name === bookingType ? startCase(bookingType) : '') : null;
  }

  public calculateSubTotal(pkgs: any[]): any {
    let amount: number = 0;
    if (pkgs) {
      pkgs.forEach(pkg => {
        const bookingType = localStorage.getItem('waBookingType') || null;
        amount += (find(pkg.attributes.availabilities, (s: any) => s.name === bookingType ? startCase(bookingType) : '') || 0).price;
      });
      amount = amount / this.subTotalDivider;
    }

    return amount || 0;
  }

  public calculateVAT(pkgs: any[]): any {
    const vat: number = this.calculateSubTotal(pkgs) * this.totalMultiplier;
    return vat < 0 ? 0 : vat.toFixed(2);
  }

  public calculateTotal(pkgs: any[]): any {
    let amount: number = 0;
    if (pkgs) {
      pkgs.forEach(pkg => {
        const bookingType = localStorage.getItem('waBookingType') || null;
        amount += (find(pkg.attributes.availabilities, (s: any) => s.name === bookingType ? startCase(bookingType) : '') || 0).price;
      });
    }

    this.myOrderService.setTotalAmount(amount);

    return amount <= 0 ? 0 : amount.toFixed(2);
  }
}
