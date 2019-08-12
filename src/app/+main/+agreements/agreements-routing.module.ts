import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreementAddComponent } from './agreement-add/agreement-add.component';

const routes: Routes = [
	{
		path: 'corporate',
		loadChildren: './+corporate/corporate.module#CorporateModule'
	},
	{
		path: 'reseller',
		loadChildren: './+reseller/reseller.module#ResellerModule'
	},
	{
		path: 'add',
		component: AgreementAddComponent,
		data: {
			title: 'Add Agreement',
		},
	},
];

@NgModule(
	{
		imports: [ RouterModule.forChild(routes) ],
		exports: [ RouterModule ]
	})
export class AgreementsRoutingModule {}
