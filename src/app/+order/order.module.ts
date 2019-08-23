import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderContainerComponent } from './container/order-container.component';
import { Routes, RouterModule } from '@angular/router';
import { MaterialFormsModule } from 'app/material-forms/material-forms.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ServicesComponent } from './components/services/services.component';
import { PackagesService } from 'app/services/api/packages/packages.service';
import { SelectFlightComponent } from './components/select-flight/select-flight.component';
import { ProgressLineComponent } from './components/progress-line/progress-line.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { CalendarModule } from 'primeng/calendar';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { FlightService, OrderService, MyOrderService, CheckoutService } from './services/order.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from './components/datepicker/datepicker.component';
import { OrderPanelComponent } from './components/order-panel/order-panel.component';
import { OrderNavComponent } from './components/order-nav/order-nav.component';
import { OrderTypeComponent } from './components/order-type/order-type.component';
import { PackageComponent } from './components/select-package/package.component';
import { PassengerComponent } from './components/passenger/passenger.component';
import { DropdownSearchComponent } from './components/dropdown-search/dropdown-search.component';
import { DropdownModule } from 'primeng/dropdown';
import { MazayaDatepickerComponent } from './components/mazaya-datepicker/datepicker.component';
import { LocationComponent } from './components/location/location.component';
import { AgmCoreModule } from '@agm/core';
import { GeoCodingService } from './services/geocoding.service';
import { GooglePlacesDirective } from 'app/shared/directives/google-places.directive';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PaymentService } from './services/payment.service';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { IsLoggedInGuard } from 'app/guards/is-logged-in.guard';
import { ResellerDialogComponent } from './components/reseller-dialog/reseller-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

const route: Routes = [{
  path: '',
  component: OrderContainerComponent,
  canActivate: [IsLoggedInGuard],
  children: [
    { path: 'select-flight', component: SelectFlightComponent },
    { path: 'order-type', component: OrderTypeComponent },
    { path: 'package', component: PackageComponent },
    { path: 'passenger', component: PassengerComponent },
    { path: 'location', component: LocationComponent },
    { path: 'payment-success', component: PaymentSuccessComponent }
  ]
}
]

@NgModule({
  declarations: [
    OrderContainerComponent,
    ServicesComponent,
    SelectFlightComponent,
    ProgressLineComponent,
    DatePickerComponent,
    OrderPanelComponent,
    OrderNavComponent,
    OrderTypeComponent,
    PackageComponent,
    PassengerComponent,
    DropdownSearchComponent,
    MazayaDatepickerComponent,
    LocationComponent,
    GooglePlacesDirective,
    PaymentSuccessComponent,
    ResellerDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialFormsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FlexLayoutModule,
    MatStepperModule,
    MatTabsModule,
    CalendarModule,
    NgxErrorsModule,
    NgbModule,
    DialogModule,
    DropdownModule,
    DialogModule,
    AgmCoreModule,
    RadioButtonModule,
    MatDialogModule,
    RouterModule.forChild(route)
  ],
  entryComponents: [ResellerDialogComponent],
  exports: [],
  providers: [
    PackagesService,
    FlightService,
    OrderService,
    MyOrderService,
    GeoCodingService,
    PaymentService,
    CheckoutService
  ],
})

export class OrderModule { }
