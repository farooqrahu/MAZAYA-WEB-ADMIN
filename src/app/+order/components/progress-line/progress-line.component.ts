import { Component, OnInit } from '@angular/core';
import { MyOrderService } from 'app/+order/services/order.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// public get getAddress(): Observable<any> {
//   return of(JSON.parse(localStorage.getItem('waAddress'))) || this.myOrderService.address$;
// }
// public get getPassengers(): Observable<any> {
//   return of(JSON.parse(localStorage.getItem('waPassengers'))) || this.myOrderService.psngrs$;
// }
// public get getFlight(): Observable<any> {
//   return of(JSON.parse(localStorage.getItem('waSelectedFlight'))) || this.myOrderService.flight$;
// }
// public get getPkg(): Observable<any> {
//   return of(JSON.parse(localStorage.getItem('waSelectedPackage'))) || this.myOrderService.pkg$;
// }
@Component({
  selector: 'app-progress-line',
  templateUrl: './progress-line.component.html',
  styleUrls: ['./progress-line.component.scss']
})
export class ProgressLineComponent implements OnInit {
  constructor(private route: Router, private myOrderService: MyOrderService) {
    this.myOrderService.progressIndex$.subscribe(index => localStorage.setItem('waProgressIndex', JSON.stringify(index)));
  }

  ngOnInit(): void { }

  public get progressIndex(): Observable<number> {
    return this.myOrderService.progressIndex$;
  }

  public get isSelectionFastTack(): boolean {
    return JSON.parse(localStorage.getItem('waSelectedPackage')) ? JSON.parse(localStorage.getItem('waSelectedPackage')).id == 2 : false;
  }
}
