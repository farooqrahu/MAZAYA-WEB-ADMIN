import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UsersService } from '../../services/api/users/users.service';

@Component({
	           selector: 'mazaya-activate-account-modal',
	           templateUrl: './activate-account-modal.component.html',
	           styleUrls: [ './activate-account-modal.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ UsersService ]
           })
export class ActivateAccountModalComponent implements OnInit {

	constructor (private dialogRef: MatDialogRef<ActivateAccountModalComponent>,
	             @Inject(MAT_DIALOG_DATA) public data: any, private userService: UsersService) { }

	ngOnInit () {
	}

	activateAccount () {
		const user = this.data.user;
		let userId;
		if(user.attributes.user){
			userId = user.attributes.user.id;
		}else{
			userId = user.id;
		}
		this.userService.activateUser(userId).subscribe((result: any) => {
			this.dialogRef.close(true);
		},() => {

		});
	}


}
