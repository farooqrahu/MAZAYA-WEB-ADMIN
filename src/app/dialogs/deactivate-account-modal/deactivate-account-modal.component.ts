import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UsersService } from '../../services/api/users/users.service';

@Component(
	{
		selector: 'mazaya-deactivate-account-modal',
		templateUrl: './deactivate-account-modal.component.html',
		styleUrls: [ './deactivate-account-modal.component.scss' ],
		encapsulation: ViewEncapsulation.Emulated,
		providers: [UsersService]
	})
export class DeactivateAccountModalComponent implements OnInit {

	constructor (private dialogRef: MatDialogRef<DeactivateAccountModalComponent>,
	             @Inject(MAT_DIALOG_DATA) public data: any, private userService: UsersService) { }

	ngOnInit () {
	}

	deactivateAccount () {
		const user = this.data.user;
		let userId;
		if(user.attributes.user){
			userId = user.attributes.user.id;
		}else{
			userId = user.id;
		}
		this.userService.deactivateUser(userId).subscribe((result: any) => {
			this.dialogRef.close(true);
		},() => {

		});
	}

}
