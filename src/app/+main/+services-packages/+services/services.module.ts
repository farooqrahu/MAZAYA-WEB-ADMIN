import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { NgPipesModule } from 'ngx-pipes';
import { ServicesComponent } from './services/services.component';
import { ServicesAddComponent } from './services-add/services-add.component';
import { ServicesEditComponent } from './services-edit/services-edit.component';
import { MaterialFormsModule } from '../../../material-forms/material-forms.module';

@NgModule(
	{
		imports: [
			CommonModule,
			ServicesRoutingModule,
			SharedModule,
			FormsModule,
			ReactiveFormsModule,
			NgxErrorsModule,
			NgPipesModule,
			MaterialFormsModule
		],
		declarations: [
			ServicesComponent,
			ServicesAddComponent,
			ServicesEditComponent
		]
	})
export class ServicesModule {}
