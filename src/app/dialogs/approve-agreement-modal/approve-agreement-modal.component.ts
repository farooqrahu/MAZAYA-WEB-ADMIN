import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../services/api/users/users.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
	           selector: 'mazaya-approve-agreement-modal',
	           templateUrl: './approve-agreement-modal.component.html',
	           styleUrls: [ './approve-agreement-modal.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ UsersService ]
           })
export class ApproveAgreementModalComponent implements OnInit {

	constructor (private dialogRef: MatDialogRef<ApproveAgreementModalComponent>,
	             @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) { }

	ngOnInit () {
	}

	approveAgreement () {
		const agreementData = {
			"data": {
				"type": "agreement-status",
				"id": "2",
			},
		};
		this.data.observable.subscribe(res => {
			this.http.patch(`${environment.baseUrl}/agreements/${this.data.agreement.id}/relationships/agreement-status`, agreementData)
				.subscribe((res: any) => {
					this.dialogRef.close(true);
				});
		});
	}
}
