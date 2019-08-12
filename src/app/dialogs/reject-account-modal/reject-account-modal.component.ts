import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../services/api/users/users.service';

@Component({
	           selector: 'mazaya-approve-account-modal',
	           templateUrl: './reject-account-modal.component.html',
	           styleUrls: [ './reject-account-modal.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ UsersService ]
           })
export class RejectAccountModalComponent implements OnInit {

	constructor (private dialogRef: MatDialogRef<RejectAccountModalComponent>,
	             @Inject(MAT_DIALOG_DATA) public data: any, private userService: UsersService) { }

	ngOnInit () {
	}

	rejectAccount () {
		const user = this.data.user;
		let userId;
		if(user.attributes.user) {
			userId = user.attributes.user.id;
		} else {
			userId = user.id;
		}
		this.userService.rejectUser(userId).subscribe((result: any) => {
			this.dialogRef.close(true);
		},() => {

		});
	}
}
