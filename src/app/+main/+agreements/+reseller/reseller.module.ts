import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResellerRoutingModule } from './reseller-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { NgPipesModule } from 'ngx-pipes';
import { MaterialFormsModule } from '../../../material-forms/material-forms.module';
import { ResellerComponent } from './reseller/reseller.component';
import { ResellerViewComponent } from './reseller-view/reseller-view.component';

@NgModule(
	{
		imports: [
			CommonModule,
			ResellerRoutingModule,
			SharedModule,
			FormsModule,
			ReactiveFormsModule,
			NgxErrorsModule,
			NgPipesModule,
			MaterialFormsModule
		],
		declarations: [
			ResellerComponent,
			ResellerViewComponent,
		]
	})
export class ResellerModule {}
