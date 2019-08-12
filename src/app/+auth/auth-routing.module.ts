import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'logout',
		component: LogoutComponent
  },
  {
		path: 'forgot-password',
		component: ForgotPasswordComponent
	},
	{
		path: 'register',
		component: RegisterComponent
	}
];

@NgModule(
	{
		imports: [ RouterModule.forChild(routes) ],
		exports: [ RouterModule ]
	})
export class AuthRoutingModule {}
