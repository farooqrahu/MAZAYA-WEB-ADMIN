import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewOrdersComponent } from './pages/new-orders/new-orders.component';
import { AssignedOrdersComponent } from './pages/assigned-orders/assigned-orders.component';
import { ViewOrderComponent } from './pages/view-order/view-order.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'open'
	},
	{
		path: 'open',
		component: NewOrdersComponent,
		data: {
			title: 'New Orders'
		}
	},
	{
		path: 'assigned',
		component: AssignedOrdersComponent,
		data: {
			title: 'Assigned Orders'
		}
	},
	{
		path: ':orderId',
		component: ViewOrderComponent,
		data: {
			title: 'View Order'
		}
	},
	{
		path: 'booking',
		loadChildren: './+booking/booking.module#BookingModule'
	}
];

@NgModule(
	{
		imports: [ RouterModule.forChild(routes) ],
		exports: [ RouterModule ]
	})
export class OrdersRoutingModule {}
