import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialFormsModule } from '../material-forms/material-forms.module';
import { SPHeaderComponent } from './sp-header/sp-header.component';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GridTableComponent } from './grid-table/grid-table.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { ToggleSwitchComponent } from './toggle-switch/toggle-switch.component';
import { FormatDatePipe } from './pipes/format-date/format-date.pipe';
import { AddButtonComponent } from './add-button/add-button.component';

@NgModule(
	{
		exports: [
			CommonModule,
			FooterComponent,
			NavbarComponent,
			SidebarComponent,
			GridTableComponent,
			AlertModalComponent,
			ToggleSwitchComponent,
			NgbModule,
			FormatDatePipe,
			SPHeaderComponent,
			AddButtonComponent
		],
		imports: [
			RouterModule,
			CommonModule,
			NgbModule,
			MaterialFormsModule
		],
		declarations: [
			FooterComponent,
			NavbarComponent,
			SidebarComponent,
			GridTableComponent,
			AlertModalComponent,
			ToggleSwitchComponent,
			FormatDatePipe,
			SPHeaderComponent,
			AddButtonComponent
		]
	})
export class SharedModule {}
