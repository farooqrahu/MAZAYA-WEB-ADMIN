import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource, Sort, PageEvent } from '@angular/material';
import { AuthService } from 'ng2-ui-auth';
import { DeleteVoucherModalComponent } from '../../../dialogs/delete-voucher-modal/delete-voucher-modal.component';
import { VoucherDetailsModalComponent } from '../../../dialogs/voucher-details-modal/voucher-details-modal.component';
import { VouchersService } from '../../../services/api/vouchers/vouchers.service';
import { capitalize, singularize } from '../../../utils/strings';
import { findIndex } from 'lodash';
import { PackagesService } from 'app/services/api/packages/packages.service';
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface Vouchers {
  id: number,
  attributes: any;
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'mazaya-voucher-management',
  templateUrl: './voucher-management.component.html',
  styleUrls: ['./voucher-management.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [VouchersService]
})
export class VoucherManagementComponent implements OnInit {

  public vouchersPerPage = 10;
  public vouchersPerPageOptions: number[] = [10, 20, 50];
  public statusFilter = 'not-used';
  public statusFilterOptions: string[] = ['all', 'not-used', 'used', 'expired'];
  public sortBy: string = 'voucher-id';
  public searchForm: FormGroup;
  public capitalize = capitalize;
  public singularize = singularize;
  public currentPage = 1;
  public pagesCount = 1;
  public vouchers: any[];
  public vouchersPackages: any[];
  public filteredVouchers: any[];
  public columnsToDisplay: string[] = ['voucher-id', 'voucher-code', 'validity', 'actions'];
  public vouchersDataSource: MatTableDataSource<Vouchers>;
  public pageIndex: number = 1;

  searchText = '';
  textChanged: Subject<string> = new Subject<string>();

  public pageVar = {
    pageSize: 10,
    pageIndex: 1,
  }
  public pageLength: number;
  public pageSize: number = 10;
  public pageSizeOptions: number[] = [5, 10, 25, 100];

  public setPageSizeOptions(setPageSizeOptionsInput: any) {
    const pageVar = {
      pageSize: setPageSizeOptionsInput.pageSize,
      pageIndex: setPageSizeOptionsInput.pageIndex += 1
    }
    this.loadVouchers(pageVar);
  }
  public pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public loadVouchers(pageVar: any, text: string = null): void {
    this.vouchersService.getVouchers(pageVar, text).subscribe(res => {
      if (res.data) {
        this.vouchers = res.data;
        this.vouchersPackages = res.included;
        //insert packages
        this.vouchers.forEach(v => {
          let arr: any[] = [];

          this.vouchersPackages.forEach(p => {
            if (v.id == p['attributes']['voucher-id']) {
              arr.push(p['attributes']);
              v['packages'] = arr;
            }
          })
        });

        this.vouchersDataSource = new MatTableDataSource(this.vouchers);

        this.vouchersDataSource.filterPredicate = (data, filter: string) => {
          const accumulator = (currentTerm, key) => {
            return this.nestedFilterCheck(currentTerm, data, key);
          };
          const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
          // Transform the filter by converting it to lowercase and removing whitespace.
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };

        this.vouchersDataSource.data = this.vouchers;
        this.pageLength = res['meta']['total-records'];
      }
    });
  }

  nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

  constructor(private packagesService: PackagesService, private auth: AuthService, private fb: FormBuilder, private dialog: MatDialog,
    private vouchersService: VouchersService) {
    this.getPackages();

    this.searchForm = fb.group({
      searchQuery: ['']
    });

    this.textChanged.pipe(
      debounceTime(500), // wait 300ms after the last event before emitting last event
      distinctUntilChanged() // only emit if value is different from previous value
    )
      .subscribe(model => {
        console.log('model: ', model);
        this.searchText = model;
        this.loadVouchers(this.pageVar, this.searchText);
      });
  }

  ngOnInit() {
    this.loadVouchers(this.pageVar);
  }

  onChangeSearchText(text: string) {
    this.textChanged.next(text);
  }

  public sortVouchers(sort: Sort): void {

  }

  public formatStatusFilterOption(str: string) {
    return capitalize(str);
  }

  public applyFilter(filterValue: string) {
    this.vouchersDataSource.filter = filterValue.trim().toLowerCase();
  }

  public userIs(userRole: string) {
    const payload = this.auth.getPayload();
    const role: string = (<string>payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']).toLowerCase();
    return role === userRole;
  }

  public listOfPackages: any[];
  public getPackages(): void {
    this.packagesService.listAll().subscribe((result: any) => {
      this.listOfPackages = result.data.filter((_package: any) => !_package.attributes['web-only']);
    });
  }

  public showVoucherDetails(voucher: any) {
    const pkgs = this.listOfPackages;
    this.dialog.open(VoucherDetailsModalComponent, {
      width: '800px',
      data: { voucher, pkgs },
    });
  }

  public deleteVoucher(voucher: any) {
    const modalRef = this.dialog.open(DeleteVoucherModalComponent, { data: { voucher } });

    modalRef.afterClosed().subscribe((result: any) => {
      if (result !== null && typeof result !== 'undefined') {
        const index = findIndex(this.vouchers, (_voucher: any) => {
          return voucher.id === _voucher.id;
        });
        this.vouchers.splice(index, 1);
        this.vouchersDataSource.data = this.vouchers;
      }
    });
  }

  public getVoucherAgreementID(voucher: any): string | number {
    if (voucher.attributes.agreement) {
      if (voucher.attributes.agreement.id) {
        return `#${voucher.attributes.agreement.id}`;
      } else {
        return 'None';
      }
    } else {
      return 'None';
    }
  }

  public getVoucherStatus(voucher: any) {
    return 'Expired';
  }
}
