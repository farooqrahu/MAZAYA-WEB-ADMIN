import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'ng2-ui-auth';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { capitalize } from '../../../../utils/strings';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';

@Component(
  {
    selector: 'mazaya-assigned-orders',
    templateUrl: './assigned-orders.component.html',
    styleUrls: ['./assigned-orders.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
export class AssignedOrdersComponent implements OnInit, AfterViewInit {
  public selectedFilter = null;
  public orders: any[];
  public ordersPerPageOptions: number[] = [10, 20, 50];
  public ordersPerPage = 10;
  public searchForm: FormGroup;
  public sortForm: FormGroup;
  public currentPage = 1;
  public pagesCount = 0;
  public ordersCount = 0;
  public filterByDateType: 'booked-date' | 'flight-date' = 'flight-date';
  public filterBy: string = 'current';
  public filterByOptions: string[] = ['current', 'previous'];
  public searchQuery: string = '';
  public ordersDataSource = new MatTableDataSource;
  public columnsToDisplay: string[] = ['reference', 'total', 'scheduled_at', 'booked_at', 'packages', 'orderedBy', 'actions'];

  @ViewChild(MatPaginator, { static: false })
  public paginator: MatPaginator;

  constructor(private http: HttpClient, private fb: FormBuilder, private auth: AuthService) {
    this.sortForm = fb.group(
      {
        sortBy: ['flight-date-and-time-utc']
      }
    );
    this.searchForm = fb.group(
      {
        firstDate: [''],
        secondDate: ['']
      }
    );
    // this.sortForm.get('sortBy').valueChanges.subscribe(() => {
    //   this.loadOrders();
    // });

    // this.searchForm.valueChanges.subscribe((newVal) => this.filterOrders());

    this.loadOrders();
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ordersDataSource.paginator = this.paginator;
      console.log(this.paginator);
    }, 1000);
  }

  setSorting(sorting: string) {
    this.sortForm.get('sortBy').setValue(sorting);
  }

  public resultsLength: number = 0;
  public loadOrders() {
    let params = new HttpParams();
    params = params.append('sort', this.sortForm.get('sortBy').value);
    params = params.append('page[size]', '20');
    params = params.append('page[number]', '1');
    params = params.append('include', 'order-packages,order-status');
    params = params.append('filter[order-status]', this.filterBy);

    const payload = this.auth.getPayload();
    const role: string = (<string>payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']).toLowerCase();

    if (role === 'driver') {
      params = params.append('filter[driver]', `eq:${payload['user-id']}`);
    }
    if (role === 'operator') {
      params = params.append('filter[operator]', `eq:${payload['user-id']}`);
    }

    this.http.get(`${environment.baseUrl}/orders`, { params })
      .pipe(map((res: any) => {
        this.resultsLength = res.length;
        return res['data'];
      })).subscribe((result: any) => {
        this.orders = result;
        this.ordersDataSource = this.orders as any;

        this.ordersDataSource.filterPredicate = (data: any, filter: string): boolean => {
          return data.attributes['booking-ref'].trim().toLowerCase().includes(filter) ||
            data.attributes['booked-date-utc'].trim().toLowerCase().includes(filter) ||
            data.attributes['flight-date-and-time-utc'].trim().toLowerCase().includes(filter) ||
            data.attributes['customer-email'].trim().toLowerCase().includes(filter) ||
            data.attributes['customer-first-name'].trim().toLowerCase().includes(filter) ||
            data.attributes['customer-last-name'].trim().toLowerCase().includes(filter)
          // data.id === filter
        };
        // this.setDateFilterToday();
        this.filterOrders();
      });


  }

  applyFilter(filterValue: string) {
    this.ordersDataSource.filter = filterValue.trim().toLowerCase();
  }

  filterOrders() {
    let startDate, endDate;

    if (this.searchForm.get('firstDate').value) {
      startDate = moment(this.searchForm.get('firstDate').value).utc();
    }

    if (this.searchForm.get('secondDate').value) {
      endDate = moment(this.searchForm.get('secondDate').value).utc();
    }

    let dateProperty: string = '';

    if (this.filterByDateType === 'flight-date') {
      dateProperty = 'flight-date-and-time-utc';
    } else {
      dateProperty = 'date-time-utc';
    }

    if (startDate && !endDate) {
      this.ordersDataSource.data = this.orders.filter((order: any) => {
        return moment(order.attributes[dateProperty]).isSameOrAfter(startDate, 'day');
      });
    } else if (!startDate && endDate) {
      this.ordersDataSource.data = this.orders.filter((order: any) => {
        return moment(order.attributes[dateProperty]).isSameOrBefore(endDate, 'day');
      });
    } else if (startDate && endDate) {
      this.ordersDataSource.data = this.orders.filter((order: any) => {
        return moment(order.attributes[dateProperty]).isBetween(startDate, endDate, 'day',
          '[]');
      });
    } else {
      this.ordersDataSource.data = this.orders;
    }
  }

  get displayingOrders() {
    const startingOrder = (this.currentPage * this.ordersPerPage) - (this.ordersPerPage - 1);
    const endingOrder = startingOrder + this.ordersPerPage - 1;
    return `${startingOrder} - ${endingOrder}`;
  }

  resetDateFilter() {
    this.selectedFilter = 'reset';
    this.searchForm.reset('');
  }

  getOrderPackages(order: any) {
    const packages = [];
    order.attributes['order-packages'].forEach((_package: any) => {
      packages.push(_package.package.name);
    });
    return packages.join(', ');
  }

  setDateFilterToday() {
    this.selectedFilter = 'today';
    this.searchForm.get('firstDate').setValue(moment().format('YYYY-MM-DD'));
    this.searchForm.get('secondDate').setValue(moment().format('YYYY-MM-DD'));
  }

  setDateFilterCurrentWeek() {
    this.selectedFilter = 'thisWeek';
    this.searchForm.get('firstDate').setValue(moment().startOf('week').format('YYYY-MM-DD'));
    this.searchForm.get('secondDate').setValue(moment().endOf('week').format('YYYY-MM-DD'));
  }

  setDateFilterCurrentMonth() {
    this.selectedFilter = 'thisMonth';
    this.searchForm.get('firstDate').setValue(moment().startOf('month').format('YYYY-MM-DD'));
    this.searchForm.get('secondDate').setValue(moment().endOf('month').format('YYYY-MM-DD'));
  }

  getOrderedByRole(order: any): string {
    const createdByRole = (<string>order.attributes['created-by-role']).toLowerCase();
    if (createdByRole === 'consumer' || createdByRole === 'guest') {
      return 'Consumer';
    } else {
      return (<string>order.attributes['created-by-role']);
    }
  }

  getOrderedBy(order: any) {
    const firstName: string = order.attributes['customer-first-name'];
    const lastName: string = order.attributes['customer-last-name'];
    if (firstName && lastName) {
      return `${order.attributes['customer-first-name']} ${order.attributes['customer-last-name']}`;
    } else {
      return 'N/A';
    }
  }

  getOrderedByLabel(order: any): string {
    return `${this.getOrderedByRole(order).toLowerCase().replace(/\s+/g, '-')} label`;
  }


  formatFilterByOption(option: string) {
    return capitalize(option);
  }

  firstPage() {
    if (this.currentPage > 1) {
      this.currentPage = 1;
      this.loadOrders();
    }
  }

  nextPage() {
    if (this.currentPage + 1 <= this.pagesCount) {
      this.currentPage++;
      this.loadOrders();
    }
  }

  previousPage() {
    if (this.currentPage >= 2) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  lastPage() {
    if (this.currentPage !== this.pagesCount) {
      this.currentPage = this.pagesCount;
      this.loadOrders();
    }
  }
}
