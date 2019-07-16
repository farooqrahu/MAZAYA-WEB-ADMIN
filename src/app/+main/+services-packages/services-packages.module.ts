import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { NgPipesModule } from 'ngx-pipes';
import { ServicesPackagesRoutingModule } from './services-packages-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule(
	{
		imports: [
			CommonModule,
			FormsModule,
			ReactiveFormsModule,
			NgxErrorsModule,
			NgPipesModule,
			ServicesPackagesRoutingModule,
			SharedModule
		],
		declarations: [

		]
	})
export class ServicesPackagesModule {}
