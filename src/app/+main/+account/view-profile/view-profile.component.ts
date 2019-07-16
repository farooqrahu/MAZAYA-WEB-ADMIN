import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { UsersService } from '../../../services/api/users/users.service';
import { assignAttributes } from '../../../utils/json';

@Component({
	           selector: 'mazaya-view-profile',
	           templateUrl: './view-profile.component.html',
	           styleUrls: [ './view-profile.component.scss' ],
	           providers: [ UsersService ],
	           encapsulation: ViewEncapsulation.Emulated
           })
export class ViewProfileComponent implements OnInit {

	user: any;

	@ViewChild('avatarFileSelect', {static: false}) avatarFileSelect;

	constructor (private router: Router, private usersService: UsersService,
	             private activatedRoute: ActivatedRoute, private auth: AuthService) { }

	ngOnInit () {
		const userId = this.auth.getPayload()[ 'user-id' ];
		if ( userId ) {
			this.usersService.viewUser(userId).subscribe((result: any) => {
				this.user = result.data;
				this.user = assignAttributes(this.user, result.included);
			});
		}
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

}
