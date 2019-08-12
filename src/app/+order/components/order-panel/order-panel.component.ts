import { Component, OnInit, Input, Output } from '@angular/core';
import { MyOrder } from 'app/+order/models/order.model';
import { find, startCase, lowerCase } from 'lodash';
import { MyOrderService } from 'app/+order/services/order.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-order-panel',
  templateUrl: './order-panel.component.html',
  styleUrls: ['./order-panel.component.scss']
})
export class OrderPanelComponent implements OnInit {
  private subTotalDivider: number = 1.05;
  private totalMultiplier: number = 0.05;

  public isSubmit: boolean = true;
  public address$: Observable<any>;
  public passengers$: Observable<any>;
  public flight$: Observable<any>;
  public pkg$: Observable<any>;

  constructor(private myOrderService: MyOrderService) { }

  ngOnInit(): void {
    this.myOrderService.totalAmount$.subscribe(amount => {
      localStorage.setItem('waTotal', JSON.stringify(amount));
    })

    if (this.getAddress && this.getPassengers && this.getFlight && this.getPkg)
      this.isSubmit = false;
    else
      this.isSubmit = true;
  }

  public onSubmit(): void {
    this.myOrderService.setPaymentOption(true);
  }

  public get getAddress(): Observable<any> {
    return of(JSON.parse(localStorage.getItem('waAddress'))) || null;
  }

  public get getPassengers(): Observable<any> {
    return of(JSON.parse(localStorage.getItem('waPassengers'))) || null;
  }

  public get getFlight(): Observable<any> {
    return of(JSON.parse(localStorage.getItem('waSelectedFlight'))) || null;
  }

  public get getPkg(): Observable<any> {
    return of(JSON.parse(localStorage.getItem('waSelectedPackage'))) || null;
  }

  public flightDateLong(date: any) {
    return this.localToUtc(new Date(date))
  }

  private localToUtc(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
  }

  public getPkgPrice(pkg: any): any {
    const bookingType = localStorage.getItem('waBookingType') || null;
    return pkg ? find(pkg.attributes.availabilities, (s: any) => s.name === bookingType ? startCase(bookingType) : '') : null;
  }

  public calculateSubTotal(price: number = 0): any {
    let amount: number = price;
    amount = amount / this.subTotalDivider;
    return amount;
  }

  public calculateVAT(price: number = 0): any {
    const vat: number = this.calculateSubTotal(price) * this.totalMultiplier;
    return vat < 0 ? 0 : vat.toFixed(2);
  }

  public calculateTotal(price: number = 0): any {
    this.myOrderService.setTotalAmount(price);

    return price <= 0 ? 0 : price.toFixed(2);
  }
}
