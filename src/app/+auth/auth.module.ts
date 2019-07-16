import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { LogoutComponent } from './logout/logout.component';

@NgModule(
	{
		imports: [
			CommonModule,
			AuthRoutingModule,
			SharedModule,
			FormsModule,
			ReactiveFormsModule,
			NgxErrorsModule
		],
		declarations: [ LoginComponent, LogoutComponent ]
	})
export class AuthModule {}
