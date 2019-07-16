import { Injectable } from '@angular/core';
import { EntityService } from '../entity/entity.service';

@Injectable()
export class OrdersService extends EntityService {

	entityUrl = 'orders';

	viewOrder (orderId: number) {
		return this.view(orderId);
	}

	viewOrderWithDetails (orderId: number) {
		const includes = [
			'customer',
			'order-histories',
			'order-members',
			'order-packages',
			'order-services',
			'order-status',
			'order-status-histories',
			'payment-type',
			'payments',
			'rating'
		];
		return this.view(orderId, null, includes);
	}

}
