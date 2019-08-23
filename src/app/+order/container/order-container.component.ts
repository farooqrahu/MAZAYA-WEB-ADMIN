import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MyOrderService, OrderService } from '../services/order.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { environment } from 'environments/environment';
import { PaymentService } from '../services/payment.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UsersService } from 'app/services/api/users/users.service';
import { AuthService } from 'ng2-ui-auth';
import { map } from 'rxjs/operators';

export enum PayfortPaymentOption {
  Visa = 'VISA',
  Mastercard = 'MASTERCARD',
  Mada = 'MADA',
}

export enum PayfortPaymentCommand {
  AUTHORIZATION = 'AUTHORIZATION',
  PURCHASE = 'PURCHASE'
}

@Component({
  selector: 'app-order-container',
  templateUrl: './order-container.component.html',
  styleUrls: ['./order-container.component.scss']
})
export class OrderContainerComponent implements OnInit {
  @ViewChild('paymentFormEl', { static: false })
  public paymentFormEl: any;

  public payFor: string = 'membership';
  public payfortPaymentOption = PayfortPaymentOption;
  public selectedPaymentOption: PayfortPaymentOption = PayfortPaymentOption.Visa;
  public validForms: Boolean = true;
  public paymentForm: FormGroup;
  public formUrl: string;
  public showPaymentDetails: boolean = false;
  public isCashPayment: boolean = false;

  constructor(private route: Router, private fb: FormBuilder, private myOrderService: MyOrderService) {
    this.myOrderService.showPaymentOption$.subscribe(isVisible => {
      this.showPaymentDetails = isVisible;
    });

    this.paymentForm = this.fb.group({
      access_code: [environment.payfort.accessCode, Validators.compose([Validators.required])],
      merchant_identifier: [environment.payfort.merchantIdentifier, Validators.compose([Validators.required])],
      command: [this.payfortPaymentOption, Validators.compose([Validators.required])],
      amount: [0, Validators.compose([Validators.required])],
      currency: ['SAR', Validators.compose([Validators.required])],
      customer_email: ['', Validators.compose([Validators.required])],
      merchant_reference: ['', Validators.compose([Validators.required])],
      language: ['en', Validators.compose([Validators.required])],
      return_url: ['', Validators.compose([Validators.required])],
      signature: ['', Validators.compose([Validators.required])],
      payment_option: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
    this.myOrderService.totalAmount$.subscribe(amount => {
      this.paymentForm.get('amount').patchValue(amount);
    })
  }

  public processPayment(): void {
    if (this.showPaymentDetails)
      this.route.navigateByUrl('/order/payment-success');

    this.showPaymentDetails = false
  }

}
