import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { uuid4, createPayfortSignature } from '../utils/payfort';
import { PayfortPaymentOption, PayfortPaymentCommand } from '../container/order-container.component';

@Injectable()
export class PaymentService {

  private baseUrl: string;

  private accessCode: string;
  private merchantIdentifier: string;
  private passPhraseIn: string;
  private passPhraseOut: string;
  private returnUrl: string;

  constructor () {
    if ( environment.production ) {
      this.baseUrl = 'https://checkout.payfort.com/FortAPI/paymentPage';
    } else {
      this.baseUrl = 'https://sbcheckout.payfort.com/FortAPI/paymentPage';
    }
    this.accessCode = environment.payfort.accessCode;
    this.merchantIdentifier = environment.payfort.merchantIdentifier;
    this.passPhraseIn = environment.payfort.passPhraseIn;
    this.passPhraseOut = environment.payfort.passPhraseOut;
  }

  processPayment (amount: number, email, payFor, paymentOption: PayfortPaymentOption) {
    paymentOption = paymentOption || PayfortPaymentOption.Visa;
    const command = (paymentOption === PayfortPaymentOption.Mada ? PayfortPaymentCommand.PURCHASE : PayfortPaymentCommand.AUTHORIZATION);
    const currency = 'SAR';
    const language = 'en';
    amount *= 100;

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;

    const port = window.location.port;

    let return_url = protocol + '//' + hostname + ':' + port + '/order/payment-success';
    if ( payFor === 'membership') {
      return_url = protocol + '//' + hostname + ':' + port + '/order/payment-success';
    }
    const requestData: any = {
      access_code: this.accessCode,
      merchant_identifier: this.merchantIdentifier,
      command,
      amount,
      currency,
      customer_email: email,
      merchant_reference: uuid4(),
      language,
      return_url,
      payment_option: paymentOption
    };

    requestData.signature = createPayfortSignature(this.passPhraseIn, requestData);
    
    return {
      url: this.baseUrl,
      requestData
    };
  }

}
