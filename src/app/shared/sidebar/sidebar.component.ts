import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { ROUTES } from './sidebar-routes.config';

/**
 * JQuery Declaration
 */
declare const $: any;

/**
 * Sidebar used on all screens
 */
@Component(
	{
		selector: 'mazaya-sidebar',
		templateUrl: './sidebar.component.html',
		styleUrls: [ './sidebar.component.scss' ],
		changeDetection: ChangeDetectionStrategy.OnPush
	})
export class SidebarComponent implements OnInit {
	/**
	 * The Menu Items used in the Sidebar
	 */
	public menuItems: any[];

	/**
	 * Constructor
	 * @param router
	 * @param route
	 * @param auth
	 */
	constructor (private router: Router, private route: ActivatedRoute, private auth: AuthService) {}

	/**
	 * Run when initialized
	 */
	ngOnInit () {
		$.getScript('./assets/js/app-sidebar.js');
		this.menuItems = ROUTES.filter(menuItem => menuItem);
	}

	visibleForCurrentUser (visibleFor: string[]) {
		const payload = this.auth.getPayload();
		const role: string = (<string>payload[ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' ]).toLowerCase();
		if ( visibleFor ) {
			return visibleFor.includes('*') || visibleFor.includes(role);
		} else {
			return false;
		}
	}

}
