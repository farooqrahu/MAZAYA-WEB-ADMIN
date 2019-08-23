import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectToRoleDefaultPageGuard } from '../guards/redirect-to-role-default-page.guard';
import { FullLayoutComponent } from '../layouts/full/full-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        // canActivate: [ RedirectToRoleDefaultPageGuard ],
        component: DashboardComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'orders',
        loadChildren: './+orders/orders.module#OrdersModule'
      },
      {
        path: 'users',
        loadChildren: './+users/users.module#UsersModule'
      },
      {
        path: 'sp',
        loadChildren: './+services-packages/services-packages.module#ServicesPackagesModule'
      },
      {
        path: 'agreements',
        loadChildren: './+agreements/agreements.module#AgreementsModule'
      },
      {
        path: 'account',
        loadChildren: './+account/account.module#AccountModule'
      },
      {
        path: 'vouchers',
        loadChildren: './+vouchers/vouchers.module#VouchersModule'
      }
    ]
  }
];
@NgModule(
  {
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class MainRoutingModule { }
