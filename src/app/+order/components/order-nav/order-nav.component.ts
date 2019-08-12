import { Component, OnInit, Input } from '@angular/core';
import { MyOrderService } from 'app/+order/services/order.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { debug } from 'util';

@Component({
  selector: 'app-order-nav',
  templateUrl: './order-nav.component.html',
  styleUrls: ['./order-nav.component.scss']
})
export class OrderNavComponent implements OnInit {
  public progressIndex: number;
  
  @Input()
  public goNext: boolean = true;

  constructor(private route: Router, private myOrderService: MyOrderService) { }

  ngOnInit(): void {
    this.myOrderService.progressIndex$.subscribe(res => {
      this.progressIndex = res;
    });
  }

  public get isNext(): boolean {
    const ret: boolean = this.progressIndex == 5;
    return ret;
  }

  public onPrev(): void {
    switch (this.progressIndex) {
      case 2:
        this.route.navigateByUrl('/order/select-flight');
        break;
      case 3:
        this.route.navigateByUrl('/order/order-type');
        break;
      case 4:
        this.route.navigateByUrl('/order/package');
        break;
      case 5:
        this.route.navigateByUrl('/order/passenger');
        break;
      default:
        break;
    }

  }

  public onNext(): void {
    switch (this.progressIndex) {
      case 1:
        this.route.navigateByUrl('/order/order-type');
        break;
      case 2:
        this.route.navigateByUrl('/order/package');
        break;
      case 3:
        this.route.navigateByUrl('/order/passenger');
        break;
      case 4:
        this.route.navigateByUrl('/order/location');
        break;
      default:
        break;
    }

  }
}
