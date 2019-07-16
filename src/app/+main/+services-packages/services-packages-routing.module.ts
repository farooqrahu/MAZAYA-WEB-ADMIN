import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: 'services',
		loadChildren: './+services/services.module#ServicesModule'
	},
	{
		path: 'packages',
		loadChildren: './+packages/packages.module#PackagesModule'
	},
	{
		path: 'capacities',
		loadChildren: './+capacities/capacities.module#CapacitiesModule'
	}
];

@NgModule(
	{
		imports: [ RouterModule.forChild(routes) ],
		exports: [ RouterModule ]
	})
export class ServicesPackagesRoutingModule {}
