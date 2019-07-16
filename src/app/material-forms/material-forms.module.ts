import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatButtonModule,
	MatButtonToggleModule, MatCardModule, MatCheckboxModule,
	MatDatepickerModule, MatExpansionModule,
	MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatPaginatorModule, MatRadioModule, MatSelectModule,
	MatSlideToggleModule,
	MatSortModule, MatTableModule,
	MatTooltipModule
} from '@angular/material';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';

@NgModule({
	          imports: [
		          CommonModule,
		          MatFormFieldModule,
		          MatInputModule,
		          MatSelectModule,
		          MatTableModule,
		          MatSortModule,
		          MatPaginatorModule,
		          MatTooltipModule,
		          MatButtonToggleModule,
		          MatIconModule,
		          MatButtonModule,
		          MatCardModule,
		          MatExpansionModule,
		          MatSlideToggleModule,
		          MatListModule,
		          MatRadioModule,
		          MatCheckboxModule
	          ],
	          declarations: [],
	          exports: [
		          MatFormFieldModule,
		          MatInputModule,
		          MatSelectModule,
		          MatTableModule,
		          MatSortModule,
		          MatPaginatorModule,
		          MatTooltipModule,
		          MatButtonToggleModule,
		          MatIconModule,
		          MatButtonModule,
		          MatCardModule,
		          MatExpansionModule,
		          MatSlideToggleModule,
		          MatListModule,
		          MatRadioModule,
		          MatCheckboxModule
	          ]
          })
export class MaterialFormsModule {}
