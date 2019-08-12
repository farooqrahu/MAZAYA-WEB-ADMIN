import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VouchersService } from '../../services/api/vouchers/vouchers.service';

@Component({
  selector: 'mazaya-delete-voucher-modal',
  templateUrl: './delete-voucher-modal.component.html',
  styleUrls: ['./delete-voucher-modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [VouchersService]
})
export class DeleteVoucherModalComponent {

  constructor(private dialogRef: MatDialogRef<DeleteVoucherModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private vouchersService: VouchersService) { }

  public deleteVoucher(): void {
    this.vouchersService.delete(this.data.voucher.id).subscribe((result: any) => {
      this.dialogRef.close(true);
    });
  }

}
