import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicesComponent } from './services/services.component';
import { ServicesAddComponent } from './services-add/services-add.component';
import { ServicesEditComponent } from './services-edit/services-edit.component';

const routes: Routes = [
	{
		path: '',
		component: ServicesComponent,
		data: {
			title: 'Services Management'
		}
	},
	{
		path: 'edit/:serviceId',
		component: ServicesEditComponent,
		data: {
			title: 'Edit Service'
		}
	},
	{
		path: 'add',
		component: ServicesAddComponent,
		data: {
			title: 'Add Service'
		}
	}
];

@NgModule({
	          imports: [ RouterModule.forChild(routes) ],
	          exports: [ RouterModule ]
          })
export class ServicesRoutingModule {}
