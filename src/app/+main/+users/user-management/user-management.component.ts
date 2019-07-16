import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { AuthService } from 'ng2-ui-auth';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { UsersService } from '../../../services/api/users/users.service';
import { capitalize, singularize, toTitleCase } from '../../../utils/strings';
import * as pluralize from 'pluralize';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter, find, findIndex, orderBy } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../services/api/roles/roles.service';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { DeleteAccountModalComponent } from '../../../dialogs/delete-account-modal/delete-account-modal.component';
import { UsersDataSource } from '../datasources/UsersDataSource';

declare const $: any;

@Component(
	{
		selector: 'mazaya-user-management',
		templateUrl: './user-management.component.html',
		styleUrls: [ './user-management.component.scss' ],
		encapsulation: ViewEncapsulation.Emulated,
		providers: [ UsersService ]
	})
export class UserManagementComponent implements OnInit, AfterViewInit {

	roleFilter = 'all';

	roleFilterOptions: string[] = [ 'all', 'consumer', 'admin', 'supervisor', 'operators', 'callcenters', 'reseller',
	                                'corporate', 'drivers' ];

	statusFilter = 'all';

	statusFilterOptions: string[] = [ 'all', 'active', 'deactivated' ];

	users: any[];

	usersDataSource: UsersDataSource;

	sortForm: FormGroup;

	capitalize = capitalize;

	singularize = singularize;

	roles: any[] = [];

	columnsToDisplay: string[] = [ 'avatar', 'badge', 'name', 'status', 'actions' ];

	@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

	userCount: number = 0;

	@ViewChild('searchQuery', {static: false}) searchQuery: ElementRef;

	/**
	 * Constructor.
	 *
	 */
	constructor (private fb: FormBuilder, private router: Router, private rolesService: RolesService,
	             private dialog: MatDialog, private activatedRoute: ActivatedRoute, private auth: AuthService,
	             private usersService: UsersService) {
		this.sortForm = fb.group(
			{
				sortBy: [ 'last-name' ]
			}
		);

		this.activatedRoute.queryParams.subscribe((queryParams) => {
			if ( queryParams && queryParams[ 'role' ] && this.roleFilterOptions.indexOf(queryParams[ 'role' ]) ) {
				this.roleFilter = queryParams[ 'role' ];
			}
		});
	}

	setRoleOnURL () {
		this.router.navigate([ '.' ], {
			relativeTo: this.activatedRoute,
			queryParamsHandling: 'merge',
			queryParams: { role: this.roleFilter }
		});
	}

	async ngOnInit () {
		this.roles = await this.rolesService.loadRoles();
		this.usersDataSource = new UsersDataSource(this.usersService);
		this.loadUsers();
	}

	ngAfterViewInit () {
		fromEvent(this.searchQuery.nativeElement, 'keyup').pipe(
			debounceTime(150),
			distinctUntilChanged(),
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadUsers();
			})
		).subscribe();

		this.sortForm.get('sortBy').valueChanges.subscribe(() => {
			this.loadUsers();
		});

		this.paginator.page.pipe(
			tap(() => this.loadUsers())
		)
			.subscribe();
	}

	formatRoleFilter (str: string) {
		if ( str !== 'all' ) {
			return toTitleCase(pluralize.singular(capitalize(str)));
		} else {
			return capitalize(str);
		}
	}

	formatStatusFilterOption (str: string) {
		return capitalize(str);
	}

	getFullName (user: any) {
		try {
			if ( user.attributes[ 'full-name' ] ) {
				return user.attributes[ 'full-name' ];
			} else if ( !user.attributes[ 'full-name' ] && user.attributes[ 'first-name' ] && user.attributes[ 'last-name' ] ) {
				return `${user.attributes[ 'first-name' ]} ${user.attributes[ 'last-name' ]}`;
			} else {
				return `${user.attributes.customer[ 'first-name' ]} ${user.attributes.customer[ 'last-name' ]}`;
			}
		}
		catch ( e ) {
			return '';
		}
	}
  //filter[deleted]=ne:true
	loadUsers () {
		const pageIndex = this.paginator ? this.paginator.pageIndex : 1;
		const pageSize = this.paginator ? this.paginator.pageSize : 10;

		this.usersDataSource.loadUsers(this.roleFilter, this.statusFilter, this.roles, this.searchQuery.nativeElement.value,
		                              this.sortForm.get('sortBy').value, pageIndex, pageSize).then((data: any) => {
			console.log('data: ', data);
			this.userCount = data.count;
			this.users = data.users;
		});
	}

	routeToUserDetails (user: any) {
		const role = user.attributes[ 'user-role' ].toLowerCase();
		if ( user.type === 'users' && (!role || role !== 'consumer') ) {
			this.router.navigate([ 'app', 'users', user.id ]);
		}
		if ( user.type === 'customers' || role === 'consumer' ) {
			if ( user.type === 'customers' ) {
				this.router.navigate([ 'app', 'users', user.id, { type: 'customers' } ]);
			} else {
				if ( user.attributes.customer ) {
					this.router.navigate([ 'app', 'users', user.attributes.customer.id, { type: 'customers' } ]);
				}
			}
		}
	}

	deleteUser (user: any) {
		const dialogRef = this.dialog.open(DeleteAccountModalComponent, {
			data: { user }
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if ( result !== null && typeof result !== 'undefined' ) {
				this.loadUsers();
			}
		});
	}

	getUserAvatar (user: any) {
		if ( user.attributes[ 'image-url' ] ) {
			return user.attributes[ 'image-url' ];
		} else if ( user.attributes[ 'avatar' ] ) {
			return user.attributes[ 'avatar' ];
		} else {
			if ( !user.attributes[ 'full-name' ] || user.attributes[ 'full-name' ].length === 0 ) {
				return `https://placehold.it/50x50?text=N%2FA`;
			} else {
				const names = user.attributes[ 'full-name' ].split(' ');
				const firstInitial = names[ 0 ].charAt(0).toUpperCase();
				const lastInitial = names[ 1 ].charAt(0).toUpperCase();
				return `https://placehold.it/50x50?text=${firstInitial}${lastInitial}`;
			}
		}
	}

	userIs (userRole: string) {
		const payload = this.auth.getPayload();
		const role: string = (<string>payload[ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' ]).toLowerCase();
		return role === userRole;
	}

	getBadgeLabel (userRole: string): string {
		if ( userRole ) {
			return `${singularize(userRole.toLowerCase().replace(/\s+/g, '-'))} label`;
		} else {
			return '';
		}
	}
}
