import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MaterialFormsModule } from '../../../material-forms/material-forms.module';
import { BookingRoutingModule } from './booking-routing.module';
import { SelectFlightComponent } from './select-flight/select-flight.component';
import { SelectOrderTypeComponent } from './select-order-type/select-order-type.component';
import { SelectServicesComponent } from './select-services/select-services.component';
import { SelectMembersComponent } from './select-members/select-members.component';
import { SelectPickupLocationComponent } from './select-pickup-location/select-pickup-location.component';
import { FinalizePaymentComponent } from './finalize-payment/finalize-payment.component';
import { BookingLayoutComponent } from './booking-layout/booking-layout.component';

@NgModule({
  imports: [
    CommonModule,
    BookingRoutingModule,
    FormsModule,
    MaterialFormsModule,
    ReactiveFormsModule,
    MatStepperModule
  ],
  declarations: [SelectFlightComponent, SelectOrderTypeComponent, SelectServicesComponent, SelectMembersComponent, SelectPickupLocationComponent, FinalizePaymentComponent, BookingLayoutComponent]
})
export class BookingModule { }
