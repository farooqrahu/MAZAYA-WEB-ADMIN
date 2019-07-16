import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';

@Component(
	{
		selector: 'mazaya-new-orders',
		templateUrl: './new-orders.component.html',
		styleUrls: [ './new-orders.component.scss' ],
		encapsulation: ViewEncapsulation.None
	})
export class NewOrdersComponent implements OnInit {

	selectedFilter = null;

	orders: any[];

	searchForm: FormGroup;

	sortForm: FormGroup;

	filterByDateType: 'booked-date' | 'flight-date' = 'flight-date';

	ordersDataSource: MatTableDataSource<any>;

	columnsToDisplay: string[] = [ 'reference', 'total', 'scheduled_at', 'booked_at', 'packages', 'orderedBy',
	                               'actions' ];

	@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

	searchQuery: string = '';

	constructor (private http: HttpClient, private fb: FormBuilder) {
		this.sortForm = fb.group(
			{
				sortBy: [ 'flight-date-and-time-utc' ]
			}
		);
		this.searchForm = fb.group(
			{
				firstDate: [ '' ],
				secondDate: [ '' ]
			}
		);

		this.sortForm.get('sortBy').valueChanges.subscribe(() => {
			this.loadOrders();
		});

		this.searchForm.valueChanges.subscribe((newVal) => this.filterOrders());
	}

	ngOnInit () {
		this.loadOrders();
	}

	loadOrders () {
		let params = new HttpParams();

		params = params.append('sort', this.sortForm.get('sortBy').value);

		params = params.append('page[size]', '9999');

		params = params.append('include', 'order-packages,order-status');

		params = params.append('filter[order-status.order-status-code]', 'open');

		this.http.get(`${environment.baseUrl}/orders`, { params }).subscribe((result: any) => {
			this.orders = result.data;
			this.ordersDataSource = new MatTableDataSource(this.orders);
			this.ordersDataSource.paginator = this.paginator;
			this.ordersDataSource.filterPredicate = (data: any, filter: string): boolean => {
				return !filter || (
					data.attributes[ 'booking-ref' ].trim().toLowerCase().includes(filter) ||
					data.attributes[ 'booked-date-utc' ].trim().toLowerCase().includes(filter) ||
					data.attributes[ 'flight-date-and-time-utc' ].trim().toLowerCase().includes(filter) ||
					data.attributes[ 'customer-email' ].trim().toLowerCase().includes(filter) ||
					data.attributes[ 'customer-first-name' ].trim().toLowerCase().includes(filter) ||
					data.attributes[ 'customer-last-name' ].trim().toLowerCase().includes(filter) ||
					data.id === filter
				);
			};
			this.setDateFilterToday();
			this.filterOrders();
		});
	}

	filterOrders () {
		let startDate, endDate;

		if ( this.searchForm.get('firstDate').value ) {
			startDate = moment(this.searchForm.get('firstDate').value).utc();
		}

		if ( this.searchForm.get('secondDate').value ) {
			endDate = moment(this.searchForm.get('secondDate').value).utc();
		}

		let dateProperty: string = '';

		if ( this.filterByDateType === 'flight-date' ) {
			dateProperty = 'flight-date-and-time-utc';
		} else {
			dateProperty = 'date-time-utc';
		}

		if ( startDate && !endDate ) {
			this.ordersDataSource.data = this.orders.filter((order: any) => {
				return moment(order.attributes[ dateProperty ]).isSameOrAfter(startDate, 'day');
			});
		} else if ( !startDate && endDate ) {
			this.ordersDataSource.data = this.orders.filter((order: any) => {
				return moment(order.attributes[ dateProperty ]).isSameOrBefore(endDate, 'day');
			});
		} else if ( startDate && endDate ) {
			this.ordersDataSource.data = this.orders.filter((order: any) => {
				return moment(order.attributes[ dateProperty ]).isBetween(startDate, endDate, 'day',
				                                                          '[]');
			});
		} else {
			this.ordersDataSource.data = this.orders;
		}
	}

	resetDateFilter () {
		this.selectedFilter = 'reset';
		this.searchForm.reset('');
	}

	getOrderPackages (order: any) {
		const packages = [];
		order.attributes[ 'order-packages' ].forEach((_package: any) => {
			packages.push(_package.package.name);
		});
		return packages.join(', ');
	}

	setDateFilterToday () {
		this.selectedFilter = 'today';
		this.searchForm.get('firstDate').setValue(moment().format('YYYY-MM-DD'));
		this.searchForm.get('secondDate').setValue(moment().format('YYYY-MM-DD'));
	}

	setDateFilterCurrentWeek () {
		this.selectedFilter = 'thisWeek';
		this.searchForm.get('firstDate').setValue(moment().startOf('week').format('YYYY-MM-DD'));
		this.searchForm.get('secondDate').setValue(moment().endOf('week').format('YYYY-MM-DD'));
	}

	setDateFilterCurrentMonth () {
		this.selectedFilter = 'thisMonth';
		this.searchForm.get('firstDate').setValue(moment().startOf('month').format('YYYY-MM-DD'));
		this.searchForm.get('secondDate').setValue(moment().endOf('month').format('YYYY-MM-DD'));
	}

	applyFilter (filterValue: string) {
		this.ordersDataSource.filter = filterValue.trim().toLowerCase();
	}

	getOrderedByRole (order: any): string {
		const createdByRole = (<string>order.attributes[ 'created-by-role' ]).toLowerCase();
		if ( createdByRole === 'consumer' || createdByRole === 'guest' ) {
			return 'Consumer';
		} else {
			return (<string>order.attributes[ 'created-by-role' ]);
		}
	}

	getOrderedBy (order: any) {
		const firstName: string = order.attributes[ 'customer-first-name' ];
		const lastName: string = order.attributes[ 'customer-last-name' ];
		if ( firstName && lastName ) {
			return `${order.attributes[ 'customer-first-name' ]} ${order.attributes[ 'customer-last-name' ]}`;
		} else {
			return 'N/A';
		}
	}

	getOrderedByLabel (order: any): string {
		return `${this.getOrderedByRole(order).toLowerCase().replace(/\s+/g, '-')} label`;
	}

}
