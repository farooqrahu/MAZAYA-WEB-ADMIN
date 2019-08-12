import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorporateRoutingModule } from './corporate-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { NgPipesModule } from 'ngx-pipes';
import { MaterialFormsModule } from '../../../material-forms/material-forms.module';
import { CorporateComponent } from './corporate/corporate.component';
import { CorporateViewComponent } from './corporate-view/corporate-view.component';

@NgModule(
	{
		imports: [
			CommonModule,
			CorporateRoutingModule,
			SharedModule,
			FormsModule,
			ReactiveFormsModule,
			NgxErrorsModule,
			NgPipesModule,
			MaterialFormsModule
		],
		declarations: [
			CorporateComponent,
			CorporateViewComponent,
		]
	})
export class CorporateModule {}
