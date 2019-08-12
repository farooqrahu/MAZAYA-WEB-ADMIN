import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { NgPipesModule } from 'ngx-pipes';
import { MaterialFormsModule } from '../../../material-forms/material-forms.module';
import { SharedModule } from '../../../shared/shared.module';

import { CapacitiesRoutingModule } from './capacities-routing.module';
import { CapacitiesComponent } from './capacities/capacities.component';
import { CapacitiesAddComponent } from './capacities-add/capacities-add.component';
import { CapacitiesEditComponent } from './capacities-edit/capacities-edit.component';

@NgModule({
  imports: [
    CommonModule,
    CapacitiesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    NgPipesModule,
    MaterialFormsModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatChipsModule
  ],
  declarations: [CapacitiesComponent, CapacitiesAddComponent, CapacitiesEditComponent]
})
export class CapacitiesModule { }
