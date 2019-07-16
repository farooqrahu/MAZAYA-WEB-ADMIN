import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'profile'
			},
			{
				path: 'profile',
				component: ViewProfileComponent,
				data: {
					title: 'View Profile'
				}
			},
			{
				path: 'profile/edit',
				component: EditProfileComponent,
				data:{
					title: 'Edit Profile'
				}
			},
			{
				path: 'change-password',
				component: ChangePasswordComponent,
				data: {
					title: 'Change Password'
				}
			}
		]
	}
];

@NgModule({
	          imports: [ RouterModule.forChild(routes) ],
	          exports: [ RouterModule ]
          })
export class AccountRoutingModule {}
