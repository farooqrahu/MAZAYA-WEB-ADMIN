import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { UsersService } from '../../../services/api/users/users.service';
import { singularize } from '../../../utils/strings';
import { assignAttributes } from '../../../utils/json';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountModalComponent } from '../../../dialogs/delete-account-modal/delete-account-modal.component';
import { ActivateAccountModalComponent } from '../../../dialogs/activate-account-modal/activate-account-modal.component';
import { DeactivateAccountModalComponent } from '../../../dialogs/deactivate-account-modal/deactivate-account-modal.component';
import { ApproveAccountModalComponent } from '../../../dialogs/approve-account-modal/approve-account-modal.component';
import { RestoreAccountModalComponent } from '../../../dialogs/restore-account-modal/restore-account-modal.component';
import { RejectAccountModalComponent } from '../../../dialogs/reject-account-modal/reject-account-modal.component';

declare const $: any;

@Component(
	{
		selector: 'mazaya-user-view',
		templateUrl: './user-view.component.html',
		styleUrls: [ './user-view.component.scss' ],
		encapsulation: ViewEncapsulation.Emulated,
		providers: [ UsersService ]
	})
export class UserViewComponent implements OnInit {

	user: any;

	@ViewChild('avatarFileSelect', {static: false}) avatarFileSelect;

	isCustomer = false;

	constructor (private router: Router, private usersService: UsersService,
	             private activatedRoute: ActivatedRoute, private dialog: MatDialog, private auth: AuthService) {
	}

	ngOnInit () {
		this.activatedRoute.params.subscribe((params) => {
			if ( params[ 'type' ] ) {
				this.isCustomer = true;
				this.usersService.viewCustomer(params[ 'id' ]).subscribe((result: any) => {
					this.user = result.data;
					console.log('this.user: ', this.user);
					this.user = assignAttributes(this.user, result.included);
				});
			} else {
				this.isCustomer = false;
				this.usersService.viewUser(params[ 'id' ]).subscribe((result: any) => {
					this.user = result.data;
					console.log('result: ', result);
					this.user = assignAttributes(this.user, result.included);
					console.log('this.user: ', this.user);
				});
			}
		});
	}

	selectNewAvatar (event) {
		event.preventDefault();
		this.avatarFileSelect.nativeElement.click();
	}

	uploadAndSaveNewAvatar () {
		const avatarFileSelect = this.avatarFileSelect.nativeElement;
		const file = avatarFileSelect.files[ 0 ];

		const formData = new FormData();

		formData.append('file', file);
		formData.append('filename', this.user.types + '--' + this.user.id + file.name);
		formData.append('image_type', 'avatar');

		this.usersService.updateAvatar(this.user.id, formData).subscribe((result: any) => {
			if ( this.user.attributes.user ) {
				this.user.attributes[ 'avatar' ] = result.url;
			}
		});
	}

	showDeleteModal (event) {
		event.preventDefault();
		const dialogRef = this.dialog.open(DeleteAccountModalComponent, {
			data: {
				user: this.user
			}
		});
		dialogRef.afterClosed().subscribe((result: any) => {
			if ( result !== null && typeof result !== 'undefined' ) {
				this.router.navigate([ 'app', 'users' ]);
			}
		});
	}

	showActivateModal (event) {
		event.preventDefault();
		const dialogRef = this.dialog.open(ActivateAccountModalComponent, {
			data: {
				user: this.user
			}
		});
		dialogRef.afterClosed().subscribe((result: any) => {
			if ( result !== null && typeof result !== 'undefined' ) {
				if ( this.isCustomer ) {
					this.user.attributes.user.attributes[ 'de-activated' ] = false;
				} else {
					this.user.attributes[ 'de-activated' ] = false;
				}
			}
		});
	}

	showDeactivateModal (event) {
		event.preventDefault();
		const dialogRef = this.dialog.open(DeactivateAccountModalComponent, {
			data: {
				user: this.user
			}
		});
		dialogRef.afterClosed().subscribe((result: any) => {
			if ( result !== null && typeof result !== 'undefined' ) {
				if ( this.isCustomer ) {
					this.user.attributes.user.attributes[ 'de-activated' ] = true;
				} else {
					this.user.attributes[ 'de-activated' ] = true;
				}
			}
		});
	}

	showApproveModal(event) {
		event.preventDefault();
		const dialogRef = this.dialog.open(ApproveAccountModalComponent, {
			data: {
				user: this.user
			}
		});
		dialogRef.afterClosed().subscribe((result: any) => {
			console.log('result: ', result);
			if ( result !== null && typeof result !== 'undefined' ) {
				this.user.attributes['is-approved'] = true;
				this.user.attributes['de-activated'] = false;
			}
		});
	}

	showRejectModal(event) {
		event.preventDefault();
		const dialogRef = this.dialog.open(RejectAccountModalComponent, {
			data: {
				user: this.user
			}
		});
		dialogRef.afterClosed().subscribe((result: any) => {
			console.log('result: ', result);
			if ( result !== null && typeof result !== 'undefined' ) {
				this.user.attributes[ 'is-rejected' ] = true;
			}
		});
	}

	showRestoreModal (event) {
		event.preventDefault();
		const dialogRef = this.dialog.open(RestoreAccountModalComponent, {
			data: {
				user: this.user
			}
		});
		dialogRef.afterClosed().subscribe((result: any) => {
			if ( result !== null && typeof result !== 'undefined' ) {
				if ( this.isCustomer ) {
					this.user.attributes.user.attributes.deleted = false;
				} else {
					this.user.attributes.deleted = false;
				}
			}
		});
	}

	isDeactivated () {
		if ( this.isCustomer ) {
			return this.user.attributes.user.attributes[ 'de-activated' ];
		} else {
			return this.user.attributes[ 'de-activated' ];
		}
	}

	isDeleted () {
		if ( this.isCustomer ) {
			return this.user.attributes.user.attributes.deleted;
		} else {
			return this.user.attributes.deleted;
		}
	}

	routeToEdit () {
		if ( this.isCustomer ) {
			this.router.navigate([ '/', 'app', 'users', this.user.id, 'edit', { type: 'customer' } ]);
		} else {
			this.router.navigate([ '/', 'app', 'users', this.user.id, 'edit' ]);
		}
	}

	userIs (userRole: string) {
		const payload = this.auth.getPayload();
		const role: string = (<string>payload[ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' ]).toLowerCase();
		return role === userRole;
	}

	getUserPhoneNumber (user: any) {
		if ( user.attributes[ 'mobile-number' ] ) {
			return user.attributes[ 'mobile-number' ];
		} else if ( user.attributes[ 'mobile' ] ) {
			return user.attributes[ 'mobile' ];
		} else {
			return null;
		}
	}
}
