import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ServicesService } from '../../services/api/services/services.service';

@Component({
	           selector: 'mazaya-view-service-modal',
	           templateUrl: './view-service-modal.component.html',
	           styleUrls: [ './view-service-modal.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ ServicesService ]
           })
export class ViewServiceModalComponent implements OnInit {

	service: any;

	constructor (private dialogRef: MatDialogRef<ViewServiceModalComponent>,
	             @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
	             private servicesService: ServicesService) {
		this.service = data.service;
	}

	ngOnInit () {
	}

	editService () {
		this.router.navigate([ 'app', 'sp', 'services', 'edit', this.service.id ]);
		this.dialogRef.close(null);
	}

	deleteService () {
		this.servicesService.delete(this.service.id).subscribe((result: any) => {
			this.dialogRef.close(true);
		},(error) => {

		});
	}

}
