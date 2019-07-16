import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingLayoutComponent } from './booking-layout/booking-layout.component';
import { FinalizePaymentComponent } from './finalize-payment/finalize-payment.component';
import { SelectFlightComponent } from './select-flight/select-flight.component';
import { SelectMembersComponent } from './select-members/select-members.component';
import { SelectOrderTypeComponent } from './select-order-type/select-order-type.component';
import { SelectPickupLocationComponent } from './select-pickup-location/select-pickup-location.component';
import { SelectServicesComponent } from './select-services/select-services.component';

const routes: Routes = [
	{
		path: '',
		component: BookingLayoutComponent,
		children: [
			{
				path: 'select-flight',
				component: SelectFlightComponent,
				data: {
					title: 'Booking :: Select Flight',
					step: 1
				}
			},
			{
				path: 'select-order-type',
				component: SelectOrderTypeComponent,
				data: {
					title: 'Booking :: Select Order Type',
					step: 2
				}
			},
			{
				path: 'select-services',
				component: SelectServicesComponent,
				data: {
					title: 'Booking :: Select Services',
					step: 3
				}
			},
			{
				path: 'select-members',
				component: SelectMembersComponent,
				data: {
					title: 'Booking :: Select Members',
					step: 4
				}
			},
			{
				path: 'select-pickup',
				component: SelectPickupLocationComponent,
				data: {
					title: 'Booking :: Select Pickup Location',
					step: 5
				}
			},
			{
				path: 'finalize-payment',
				component: FinalizePaymentComponent,
				data: {
					title: 'Booking :: Finalize Payment'
				}
			}
		]
	}
];

@NgModule({
	          imports: [ RouterModule.forChild(routes) ],
	          exports: [ RouterModule ]
          })
export class BookingRoutingModule {}
