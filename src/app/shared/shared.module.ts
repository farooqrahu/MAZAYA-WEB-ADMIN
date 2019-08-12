import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from "primeng/dropdown";
import { MaterialFormsModule } from '../material-forms/material-forms.module';
import { SPHeaderComponent } from './sp-header/sp-header.component';
import { AgreementsHeaderComponent } from './agreements-header/agreements-header.component';
import { FormsModule } from "@angular/forms";
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GridTableComponent } from './grid-table/grid-table.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { ToggleSwitchComponent } from './toggle-switch/toggle-switch.component';
import { FormatDatePipe } from './pipes/format-date/format-date.pipe';
import { AddButtonComponent } from './add-button/add-button.component';
import { DropdownSelectComponent } from './dropdown-select/dropdown-select.component';
import { MatCardModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
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
			AgreementsHeaderComponent,
			AddButtonComponent,
      DropdownSelectComponent
		],
		imports: [
			RouterModule,
			CommonModule,
			NgbModule,
			MaterialFormsModule,
			DropdownModule,
      FormsModule,
      DropdownModule,
      MatCardModule,
      FlexLayoutModule
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
			AgreementsHeaderComponent,
			AddButtonComponent,
      DropdownSelectComponent
		]
	})
export class SharedModule {}
