import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../services/api/users/users.service';

@Component({
	           selector: 'mazaya-restore-account-modal',
	           templateUrl: './restore-account-modal.component.html',
	           styleUrls: [ './restore-account-modal.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ UsersService ]
           })
export class RestoreAccountModalComponent implements OnInit {

	constructor (private dialogRef: MatDialogRef<RestoreAccountModalComponent>,
	             @Inject(MAT_DIALOG_DATA) public data: any, private userService: UsersService) { }

	ngOnInit () {
	}

	restoreAccount () {
		const user = this.data.user;
		let userId;
		if(user.attributes.user){
			userId = user.attributes.user.id;
		}else{
			userId = user.id;
		}

		this.userService.restoreUser(userId).subscribe((result: any) => {
			this.dialogRef.close(true);
		},(err) => {});
	}

}
