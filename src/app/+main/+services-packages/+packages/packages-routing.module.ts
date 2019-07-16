import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackagesViewComponent } from './packages-view/packages-view.component';
import { IsPackageIdExistsGuard } from '../../../guards/is-package-id-exists.guard';
import { PackagesAddComponent } from './packages-add/packages-add.component';
import { PackagesEditComponent } from './packages-edit/packages-edit.component';
import { PackagesComponent } from './packages/packages.component';

const routes: Routes = [
	{
		path: '',
		component: PackagesComponent,
		data: {
			title: 'Packages Management'
		}
	},
	{
		path: 'view/:packageId',
		component: PackagesViewComponent,
		data: {
			title: 'Package Details'
		}
	},
	{
		path: 'edit/:packageId',
		component: PackagesEditComponent,
		data: {
			title: 'Edit Package'
		}
	},
	{
		path: 'add',
		component: PackagesAddComponent,
		data: {
			title: 'Add Package'
		}
	}
];

@NgModule(
	{
		imports: [ RouterModule.forChild(routes) ],
		exports: [ RouterModule ]
	})
export class PackagesRoutingModule {}
