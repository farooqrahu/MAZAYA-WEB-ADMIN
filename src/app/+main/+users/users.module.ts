import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { NgPipesModule } from 'ngx-pipes';
import { UsersRoutingModule } from './users-routing.module';
import { MembershipApprovalComponent } from './consumers/membership-approval/membership-approval.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SharedModule } from '../../shared/shared.module';
import { UserViewComponent } from './user-view/user-view.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialFormsModule } from '../../material-forms/material-forms.module';

@NgModule(
	{
		imports: [
			CommonModule,
			UsersRoutingModule,
			FormsModule,
			ReactiveFormsModule,
			NgPipesModule,
			SharedModule,
			NgxErrorsModule,
			NgbModule,
			MatDialogModule,
			MaterialFormsModule
		],
		declarations: [
			MembershipApprovalComponent,
			UserManagementComponent,
			UserViewComponent,
			UserAddComponent,
			UserEditComponent
		],
		providers: []
	})
export class UsersModule {}
