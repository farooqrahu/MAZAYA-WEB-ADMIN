import { Component, OnInit } from '@angular/core';
import { MyOrderService } from 'app/+order/services/order.service';
import { ProgressIndex } from 'app/+order/models/order.model';
import { find, startCase, lowerCase } from 'lodash';

@Component({
  selector: 'app-order-type',
  templateUrl: './order-type.component.html',
  styleUrls: ['./order-type.component.scss']
})
export class OrderTypeComponent implements OnInit {
  public progressIndex = ProgressIndex;
  public orderTypes: any = [{
    id: 0,
    text: 'Individual',
    img: 'ic_single.png'
  },
  {
    id: 1,
    text: 'Family',
    img: 'ic_family.png'
  }]

  constructor(private myOrderService: MyOrderService) {
    this.myOrderService.setProgressIndex(this.progressIndex.order);
    this.myOrderService.setProgressLine(this.progressIndex.order);
  }

  ngOnInit(): void { }

  public get getSelectedOrder(): number {
    return JSON.parse(localStorage.getItem('waSelectedOrder')) || null;
  }

  public onSelect(index: number, text: string): void {
    localStorage.setItem('waSelectedOrder', JSON.stringify(index));
    localStorage.setItem('waBookingType', startCase(text));
  }
}