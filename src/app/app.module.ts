import { NgModule } from '@angular/core';
import { DateAdapter, MatButtonModule, MatDatepickerModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatetimeAdapter, MAT_DATETIME_FORMATS, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule, MomentDatetimeAdapter } from '@mat-datetimepicker/moment';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RedirectToRoleDefaultPageGuard } from './guards/redirect-to-role-default-page.guard';
import { CapacitiesService } from './services/api/capacities/capacities.service';
import { CheckoutService } from './services/checkout/checkout.service';
import { GeocodingService } from './services/geocoding/geocoding.service';
import { SharedModule } from './shared/shared.module';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { WebStorageModule } from 'ngx-store';
import { RecaptchaModule } from 'ng-recaptcha';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { ContextMenuModule } from 'ngx-contextmenu';
import { MomentModule } from 'angular2-moment';
import { LaddaModule } from 'angular2-ladda';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PageNotFoundComponent } from './app-components/page-not-found/page-not-found.component';
import { ChangeLanguageComponent } from './app-components/change-language/change-language.component';
import { Ng2UiAuthModule } from 'ng2-ui-auth';
import { JSONRequestInterceptor, JWTInterceptor } from './shared/config/interceptors';
import {
	IsAdmin,
	IsCorporate,
	IsNotLoggedIn,
	IsOperator,
	IsReseller,
	IsLoggedIn,
	IsOrderExists,
	IsUseridExists,
	IsPackageIdExists
} from './shared/config/guards';
import { authOptions } from './shared/config/authOptions';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
import { SpinnerComponent } from './app-components/spinner/spinner.component';
import { OrderService } from './services/order/order.service';
import { ApiService } from './services/api/api.service';
import { Dialogs } from './dialogs/dialogs';
import { MatDialogModule } from '@angular/material/dialog';
import { RolesService } from './services/api/roles/roles.service';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { environment } from '../environments/environment';
import { AgmCoreModule } from '@agm/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatListModule} from '@angular/material/list';

library.add(fas, fab, far);

const Guards = [
	IsLoggedIn,
	IsNotLoggedIn,
	IsAdmin,
	IsReseller,
	IsCorporate,
	IsOperator,
	IsOrderExists,
	IsUseridExists,
	IsPackageIdExists,
	RedirectToRoleDefaultPageGuard
];

const TopLevelComponents = [
	PageNotFoundComponent,
	ChangeLanguageComponent,
	SpinnerComponent
];

const Interceptors = [
	JSONRequestInterceptor,
	JWTInterceptor
];

@NgModule(
	{
		declarations: [
			AppComponent,
			...TopLevelComponents,
			...Dialogs
		],
		imports: [
			BrowserAnimationsModule,
			BrowserModule,
			HttpClientModule,
			AppRoutingModule,
			SharedModule,
			// NgbModule.forRoot(),
			NgxErrorsModule,
			WebStorageModule,
			RecaptchaModule.forRoot(),
			PrettyJsonModule,

			MomentModule,
			LaddaModule,
			InfiniteScrollModule,
			Ng2UiAuthModule.forRoot(authOptions, false),
			NgHttpLoaderModule,
			MatDialogModule,
			MatProgressBarModule,
			AgmCoreModule.forRoot({ apiKey: environment.googleMaps.key, libraries: [ 'places' ] }),
			FontAwesomeModule,
			MatMomentDatetimeModule,
			MatMomentDateModule,
			MatButtonModule,
      MatIconModule,
      MatListModule
		],
		providers: [
			...Interceptors,
			...Guards,
			OrderService,
			ApiService,
			RolesService,
			CapacitiesService,
			GeocodingService,
			CheckoutService,
			{
				provide: DateAdapter,
				useClass: MomentDateAdapter
			},
			{
				provide: DatetimeAdapter,
				useClass: MomentDatetimeAdapter
			},
			{
				provide: MAT_DATETIME_FORMATS,
				useValue: {
					parse: {
						dateInput: "DD/MM/YYYY",
						monthInput: "MMMM",
						timeInput: "HH:mm",
						datetimeInput: "DD/MM/YYYY HH:mm"
					},
					display: {
						dateInput: "DD/MM/YYYY",
						monthInput: "MMMM",
						datetimeInput: "DD/MM/YYYY HH:mm",
						timeInput: "HH:mm",
						monthYearLabel: "MMM YYYY",
						dateA11yLabel: "MMMM DD, YYYY",
						monthYearA11yLabel: "MMMM YYYY",
						popupHeaderDateLabel: "ddd, DD MMM"
					}
				}
			}
		],
		bootstrap: [ AppComponent ],
		entryComponents: [ SpinnerComponent, ...Dialogs ]
	})
export class AppModule {}
