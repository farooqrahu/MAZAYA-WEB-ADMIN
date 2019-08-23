import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';

import { ContentBoxComponent } from '../shared/content-box/content-box.component';
import { FullLayoutComponent } from '../layouts/full/full-layout.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';
import { MaterialFormsModule } from '../material-forms/material-forms.module';
import { MatListModule } from '@angular/material/list';
@NgModule(
	{
		imports: [
			CommonModule,
			FormsModule,
			MainRoutingModule,
			SharedModule,
			ChartsModule,
			NgxChartsModule,
			NgPipesModule,
      MaterialFormsModule,
      MatListModule
		],
		declarations: [
			ContentBoxComponent,
			DashboardComponent,
      FullLayoutComponent
		],
		providers: []
	})
export class MainModule {}
