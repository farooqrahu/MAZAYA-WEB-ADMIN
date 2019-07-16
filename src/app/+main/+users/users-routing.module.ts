import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembershipApprovalComponent } from './consumers/membership-approval/membership-approval.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserViewComponent } from './user-view/user-view.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { IsUseridExistsGuard } from '../../guards/is-userid-exists.guard';

const routes: Routes = [
	{
		path: '',
		component: UserManagementComponent,
		data: {
			title: 'User Management'
		}
	},
	{
		path: 'new',
		component: UserAddComponent,
		data: {
			title: 'Create User'
		}
	},
	{
		path: ':id',
		component: UserViewComponent,
		data: {
			title: 'View User'
		}
	},
	{
		path: ':userId/edit',
		component: UserEditComponent,
		data: {
			title: 'Edit Users'
		}
	},
	{
		path: 'admins',
		children: []
	},
	{
		path: 'resellers',
		children: []
	},
	{
		path: 'consumers',
		children: [
			{
				path: 'membership-approval',
				component: MembershipApprovalComponent
			}
		]
	}
];

@NgModule(
	{
		imports: [ RouterModule.forChild(routes) ],
		exports: [ RouterModule ]
	})
export class UsersRoutingModule {}
