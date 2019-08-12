// npm packages
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatDatepickerModule,
	MatDialogModule,
	MatNativeDateModule,
	MatSlideToggleModule
} from '@angular/material';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { NgPipesModule } from 'ngx-pipes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';

// our packages
import { AgreementsRoutingModule } from './agreements-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AgreementAddComponent } from './agreement-add/agreement-add.component';
import { VouchersService } from '../../services/api/vouchers/vouchers.service';
import { MaterialFormsModule } from '../../material-forms/material-forms.module';
import { PackagesService } from '../../services/api/packages/packages.service';

@NgModule(
	{
		imports: [
			CommonModule,
			AgreementsRoutingModule,
			FormsModule,
			ReactiveFormsModule,
			MaterialFormsModule,
			MatDatepickerModule, //
			MatNativeDateModule, //
			MatSlideToggleModule, //
			SharedModule,
			NgbModule, //
			MatDialogModule, //
			NgPipesModule,
			NgxErrorsModule,
			MatDatetimepickerModule, //
		],
		declarations: [
			AgreementAddComponent,
		],
		providers: [
			PackagesService,
			VouchersService,
		],
	})
export class AgreementsModule {}
