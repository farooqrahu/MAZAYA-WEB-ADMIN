import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackagesRoutingModule } from './packages-routing.module';
import { PackagesComponent } from './packages/packages.component';
import { PackagesEditComponent } from './packages-edit/packages-edit.component';
import { PackagesAddComponent } from './packages-add/packages-add.component';
import { PackagesViewComponent } from './packages-view/packages-view.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { NgPipesModule } from 'ngx-pipes';
import { MaterialFormsModule } from '../../../material-forms/material-forms.module';

@NgModule(
	{
		imports: [
			CommonModule,
			PackagesRoutingModule,
			SharedModule,
			FormsModule,
			ReactiveFormsModule,
			NgxErrorsModule,
			NgPipesModule,
			MaterialFormsModule
		],
		declarations: [
			PackagesViewComponent,
			PackagesAddComponent,
			PackagesEditComponent,
			PackagesComponent
		]
	})
export class PackagesModule {}
