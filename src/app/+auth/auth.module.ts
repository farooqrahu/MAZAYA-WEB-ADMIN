import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { LogoutComponent } from './logout/logout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { NgxMaskModule } from "ngx-mask";

@NgModule(
	{
		imports: [
			CommonModule,
			AuthRoutingModule,
			SharedModule,
			FormsModule,
			ReactiveFormsModule,
			NgxErrorsModule,
			NgxMaskModule.forRoot(),
		],
		declarations: [ LoginComponent, LogoutComponent, ForgotPasswordComponent, RegisterComponent ]
	})
export class AuthModule {}
