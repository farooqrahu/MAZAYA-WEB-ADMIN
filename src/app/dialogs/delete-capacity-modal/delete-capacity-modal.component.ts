import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CapacitiesService } from '../../services/api/capacities/capacities.service';

@Component({
	           selector: 'mazaya-delete-capacity-modal',
	           templateUrl: './delete-capacity-modal.component.html',
	           styleUrls: [ './delete-capacity-modal.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated
           })
export class DeleteCapacityModalComponent implements OnInit {

	constructor (private capacitiesService: CapacitiesService,
	             private dialogRef: MatDialogRef<DeleteCapacityModalComponent>,
	             @Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit () {
	}

	deleteCapacity () {
		this.capacitiesService.delete(this.data.capacity.id).subscribe(
			(result: any) => {
				this.dialogRef.close(true);
			}, (error) => {});
	}

}
