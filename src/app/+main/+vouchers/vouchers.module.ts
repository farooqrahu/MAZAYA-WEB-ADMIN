import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatSlideToggleModule, MatAutocompleteModule, MatChipsModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgPipesModule } from 'ngx-pipes';
import { MaterialFormsModule } from '../../material-forms/material-forms.module';
import { SharedModule } from '../../shared/shared.module';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { VoucherManagementComponent } from './voucher-management/voucher-management.component';
import { VoucherAddComponent } from './voucher-add/voucher-add.component';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { PackagesService } from 'app/services/api/packages/packages.service';
import { VouchersService } from 'app/services/api/vouchers/vouchers.service';
import { VoucherEditComponent } from './voucher-edit/voucher-edit.component';
import {MatListModule} from '@angular/material/list';
@NgModule({
  imports: [
    CommonModule,
    VouchersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    SharedModule,
    NgbModule,
    MatDialogModule,
    NgPipesModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    NgPipesModule,
    MaterialFormsModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatListModule
  ],
  declarations: [VoucherManagementComponent, VoucherAddComponent, VoucherEditComponent],
  providers: [ PackagesService, VouchersService ]
})
export class VouchersModule { }
