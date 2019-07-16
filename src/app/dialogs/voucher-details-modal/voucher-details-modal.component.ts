import { Component, Inject, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { VouchersService } from '../../services/api/vouchers/vouchers.service';
import * as moment from 'moment';
import { PackagesService } from 'app/services/api/packages/packages.service';

@Component({
  selector: 'mazaya-voucher-details-modal',
  templateUrl: './voucher-details-modal.component.html',
  styleUrls: ['./voucher-details-modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [VouchersService]
})
export class VoucherDetailsModalComponent implements OnInit {
  constructor(private packagesService: PackagesService, public dialogRef: MatDialogRef<VoucherDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private vouchersService: VouchersService,
    private router: Router) {

  }

  ngOnInit() {
  }

  deleteVoucher() {
    this.vouchersService.delete(this.data.voucher.id).subscribe((result: any) => {
      this.dialogRef.close(true);
    });
  }

  private formatUtc(date: any): any {
    const offset = moment().utcOffset();
    return moment.utc(date).utcOffset(offset).format();
  }

  public formatDate(date: string): string {
    return moment(date).format("Do MMM YYYY");
  }

  public formatTime(date: string) {
    return moment(this.formatUtc(date)).format('LT');
  }

  public get getVoucherRelationships(): any {
    return this.data ? this.data['voucher']['packages'] : null;
  }

  public getVoucherPackages(data: any): any {

  }

  public getPackage(id: any): string {
    return this.data.pkgs ? this.data.pkgs.filter(x => x.id == id)[0] : null;
  }

  public get getVoucherInfo(): any {
    return this.data ? this.data['voucher']['attributes'] : null;
  }

  editVoucher() {
    this.router.navigateByUrl('app/vouchers/edit/' + this.data.voucher.id);
    this.dialogRef.close();
  }

}
