import { Component, OnInit } from '@angular/core';
import { OrderService, CheckoutService, MyOrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  public orderSuccess: boolean;
  public bookingRef: string;

  constructor(private route: Router, private myOrderService: MyOrderService, private checkoutService: CheckoutService, private orderService: OrderService) {
  }

  public uploadMemberPassport(member: any): Promise<string> {
    return new Promise((resolve) => {
      const passport: FormData = new FormData();
      passport.append('filename', member['email'] + '-pp-scan-' + Date.now() + '.png');
      passport.append('image_type', 'passport');

      this.orderService.uploadPassport(passport).subscribe(res => resolve(res.url), () => resolve(''));
    });
  }

  async ngOnInit() {
    const order = await this.checkoutService.getOrderData();
    debugger
    if(order) {
      this.orderService.setOrder(order).subscribe(res => {
        if(res) {
          this.bookingRef = res.data['attributes']['booking-ref'];
          this.orderSuccess = true;

          localStorage.removeItem('waPassengers');
          localStorage.removeItem('waSelectedFlight');
          localStorage.removeItem('waSelectedOrder');
          localStorage.removeItem('waLocation');
          localStorage.removeItem('waAddress');
          localStorage.removeItem('waTotal');
          localStorage.removeItem('waSelectedFlightIndex');
          localStorage.removeItem('waSelectedPackage');
          localStorage.removeItem('waBookingType');
          localStorage.removeItem('waTotal');
          localStorage.removeItem('waSelectedPackageIndex');
          
          localStorage.setItem('waProgressIndex', JSON.stringify(1));
          
          this.myOrderService.clearService();
        }
      }, (error) => {
        this.orderSuccess = false;
      })
    } else {
      this.route.navigateByUrl('/order/select-flight');
    }
  }
}
