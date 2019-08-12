import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../services/api/users/users.service';

@Component({
	           selector: 'mazaya-approve-account-modal',
	           templateUrl: './approve-account-modal.component.html',
	           styleUrls: [ './approve-account-modal.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ UsersService ]
           })
export class ApproveAccountModalComponent implements OnInit {

	constructor (private dialogRef: MatDialogRef<ApproveAccountModalComponent>,
	             @Inject(MAT_DIALOG_DATA) public data: any, private userService: UsersService) { }

	ngOnInit () {
	}

	approveAccount () {
		const user = this.data.user;
		let userId;
		if(user.attributes.user) {
			userId = user.attributes.user.id;
		} else {
			userId = user.id;
		}
		this.userService.approveUser(userId).subscribe((result: any) => {
			this.dialogRef.close(true);
		},() => {

		});
	}
}
