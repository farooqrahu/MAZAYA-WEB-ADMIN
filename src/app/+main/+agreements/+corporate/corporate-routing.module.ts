import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CorporateComponent } from './corporate/corporate.component';
import { CorporateViewComponent } from './corporate-view/corporate-view.component';

const routes: Routes = [
	{
		path: '',
		component: CorporateComponent,
		data: {
			title: 'All Agreements'
		}
	},
	{
		path: 'view/:corporateId',
		component: CorporateViewComponent,
		data: {
			title: 'My Agreements'
		}
	},
];

@NgModule(
	{
		imports: [ RouterModule.forChild(routes) ],
		exports: [ RouterModule ]
	})
export class CorporateRoutingModule {}
