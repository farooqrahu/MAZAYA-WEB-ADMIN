import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialFormsModule } from '../../material-forms/material-forms.module';
import { SharedModule } from '../../shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PackagesService } from 'app/services/api/packages/packages.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrderModule } from 'app/+order/order.module';
import { NgxMaskModule } from "ngx-mask";

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialFormsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    FontAwesomeModule,
    FlexLayoutModule,
    OrderModule,
		NgxMaskModule.forRoot(),
  ],
  declarations: [ViewProfileComponent, ChangePasswordComponent, EditProfileComponent, ChangePasswordComponent],
  providers: [ PackagesService ]
})
export class AccountModule { }
