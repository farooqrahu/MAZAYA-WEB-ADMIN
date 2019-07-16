import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrdersRoutingModule } from './orders-routing.module';
import { NewOrdersComponent } from './pages/new-orders/new-orders.component';
import { AssignedOrdersComponent } from './pages/assigned-orders/assigned-orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ViewOrderComponent } from './pages/view-order/view-order.component';
import { MaterialFormsModule } from '../../material-forms/material-forms.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgmCoreModule } from '@agm/core';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';

@NgModule(
	{
		imports: [
			CommonModule,
			OrdersRoutingModule,
			MaterialFormsModule,
			FormsModule,
			ReactiveFormsModule,
			SharedModule,
			NgbModule,
			FontAwesomeModule,
			AgmCoreModule
		],
		declarations: [ NewOrdersComponent, AssignedOrdersComponent, ViewOrderComponent ]
	})
export class OrdersModule {}
