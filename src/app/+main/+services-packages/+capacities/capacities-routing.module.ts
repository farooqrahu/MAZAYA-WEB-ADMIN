import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CapacitiesAddComponent } from './capacities-add/capacities-add.component';
import { CapacitiesEditComponent } from './capacities-edit/capacities-edit.component';
import { CapacitiesComponent } from './capacities/capacities.component';

const routes: Routes = [
	{
		path: '',
		component: CapacitiesComponent,
		data: {
			title: 'Capacity Management'
		}
	},
	{
		path: 'edit/:capacityId',
		component: CapacitiesEditComponent,
		data: {
			title: 'Edit Capacity'
		}
	},
	{
		path: 'add',
		component: CapacitiesAddComponent,
		data: {
			title: 'Add Capacity'
		}
	}
];

@NgModule({
	          imports: [ RouterModule.forChild(routes) ],
	          exports: [ RouterModule ]
          })
export class CapacitiesRoutingModule {}
