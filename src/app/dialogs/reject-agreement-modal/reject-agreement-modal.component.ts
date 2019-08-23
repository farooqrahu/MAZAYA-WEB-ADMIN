import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../services/api/users/users.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
	           selector: 'mazaya-agreement-account-modal',
	           templateUrl: './reject-agreement-modal.component.html',
	           styleUrls: [ './reject-agreement-modal.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ UsersService ]
           })
export class RejectAgreementModalComponent implements OnInit {

	constructor (private dialogRef: MatDialogRef<RejectAgreementModalComponent>,
	             @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) { }

	ngOnInit () {
	}

	rejectAgreement () {
		const data = {
			"data":
				{
					"type": "agreement-status",
					"id": "3",
				},
		};
		this.http.patch(`${environment.baseUrl}/agreements/${this.data.agreement.id}/relationships/agreement-status`, data)
			.subscribe((res: any) => {
				this.dialogRef.close(true);
			});
	}
}
