import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VoucherAddComponent } from './voucher-add/voucher-add.component';
import { VoucherManagementComponent } from './voucher-management/voucher-management.component';
import { VoucherEditComponent } from './voucher-edit/voucher-edit.component';

const routes: Routes = [
	{
		path: '',
		component: VoucherManagementComponent,
		data: {
			title: 'Voucher Management'
		}
	},
	{
		path: 'new',
		component: VoucherAddComponent,
		data: {
			title: 'Add Voucher'
		}
	},
	{
		path: 'edit/:id',
		component: VoucherEditComponent,
		data: {
			title: 'Edit Voucher'
		}
	}
];

@NgModule({
	          imports: [ RouterModule.forChild(routes) ],
	          exports: [ RouterModule ]
          })
export class VouchersRoutingModule {}
