import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { OrderService } from '../services/order/order.service';

import { OrderModel } from '../models/order.model';

@Injectable()
export class IsOrderExistsGuard implements CanActivate {

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const found = this.orderService.orderExists(next.params.orderId);

    if (found.length) {
      this.orderService.setViewableOrder(new OrderModel(found[0]));

      return true;
    }

    this.router.navigate(['/app/orders']);
  }
}
