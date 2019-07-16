import { Routes } from '@angular/router';

export const Full_ROUTES: Routes = [
	{
		path: 'full-layout',
		loadChildren: './pages/full-layout-page/full-pages.module#FullPagesModule'
	}
];
