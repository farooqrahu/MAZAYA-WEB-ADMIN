import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResellerComponent } from './reseller/reseller.component';
import { ResellerViewComponent } from './reseller-view/reseller-view.component';

const routes: Routes = [
	{
		path: '',
		component: ResellerComponent,
		data: {
			title: 'All Agreements'
		}
	},
	{
		path: 'view/:resellerId',
		component: ResellerViewComponent,
		data: {
			title: 'Reseller Agreements'
		}
	},
];

@NgModule(
	{
		imports: [ RouterModule.forChild(routes) ],
		exports: [ RouterModule ]
	})
export class ResellerRoutingModule {}
