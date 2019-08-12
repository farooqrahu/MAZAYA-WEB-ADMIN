import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../services/api/users/users.service';

@Component({
  selector: 'mazaya-delete-account-modal',
  templateUrl: './delete-account-modal.component.html',
  styleUrls: ['./delete-account-modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [UsersService]
})
export class DeleteAccountModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeleteAccountModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UsersService) { }

  ngOnInit() {
  }

  deleteAccount() {
    const user = this.data.user;
    console.log('this.data.user: ', this.data.user);
    let userId;
    if (user.attributes['user-id']) {
    	userId = user.attributes['user-id'];
    } else {
      userId = user.id;
    }
    this.userService.deleteUser(userId).subscribe((result: any) => {
      this.dialogRef.close(true);
    }, (err) => {});
  }

}
