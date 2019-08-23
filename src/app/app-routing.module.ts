import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './app-components/page-not-found/page-not-found.component';
import { ChangeLanguageComponent } from './app-components/change-language/change-language.component';
import { IsNotLoggedInGuard } from './guards/is-not-logged-in.guard';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';

export const appRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				redirectTo: 'app/dashboard',
				pathMatch: 'full'
      },
      // {
			// 	path: 'dashboard',
			// 	loadChildren: './+dashboard/dashboard.module#DashboardModule'
			// },
			{
				path: 'auth',
				loadChildren: './+auth/auth.module#AuthModule',
				canActivate: [ IsNotLoggedInGuard ]
			},
			{
				path: 'app',
				loadChildren: './+main/main.module#MainModule',
				canActivate: [ IsLoggedInGuard ]
			},
			{
				path: 'order',
				loadChildren: './+order/order.module#OrderModule',
				// canActivate: [ IsLoggedInGuard ]
			}
		]
	},
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'
	}
];

@NgModule(
	{
		imports: [ RouterModule.forRoot(appRoutes) ],
		exports: [ RouterModule ]
	})

export class AppRoutingModule {
}
