import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { PackagesService } from 'app/services/api/packages/packages.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { VouchersService } from 'app/services/api/vouchers/vouchers.service';
import * as moment from 'moment';
import { VoucherPackage } from 'app/models/package.model';
import * as _ from 'lodash';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operator/map';

@Component({
  selector: 'mazaya-voucher-edit',
  templateUrl: './voucher-edit.component.html',
  styleUrls: ['./voucher-edit.component.scss']
})
export class VoucherEditComponent implements OnInit {
  public listOfPackages: any;
  public voucherForm: FormGroup;
  public fileContent: any;
  public voucherCodes: string[] = [];
  public checkedCodes: any[] = [];
  public showMFPackage: boolean = false;
  public selectedPackages: any[] = [];
  public isVoucherFromUpload: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private voucherService: VouchersService, public fb: FormBuilder, private packagesService: PackagesService) {

    this.voucherForm = this.fb.group({
      voucherId: [null, Validators.compose([Validators.required])],
      packages: new FormArray([]),
      voucherCode: [''],
      validStartDate: [moment().format(), Validators.compose([Validators.required])],
      validEndDate: [moment().format(), Validators.compose([Validators.required])],
      packagesId: [null]
    });

    this.getPackages();
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      setTimeout(() => {
        this.voucherService.editVoucher(id).subscribe(res => this.parseToForm(res))
      }, 100);
    }
  }

  onNumberInputChange(ev) {
    if (ev.target.value < 0) {
      ev.target.value = 0;
    }
    return ev;
  }

  public setPackage(pkgs: any): any {
    const packagesFormArray = <FormArray>this.voucherForm.get('packages') as FormArray;
    pkgs.forEach(pkg => {
      packagesFormArray.push(this.fb.group({
        'discount-percentage': pkg.attributes['discount-percentage'],
        'discount-amount': pkg.attributes['discount-amount'],
        'redemptions': pkg.attributes['redemptions'],
        'package-id': pkg.attributes['package-id'],
        'status-id': pkg.attributes['status-id'],
        'package-availability-id': pkg.attributes['package-availability-id'],
        'isPercentage': pkg.attributes['discount-percentage'] > 0 ? 'true' : 'false',
      }))
    });
    return packagesFormArray;
  }

  public parseToForm(res: any): void {
    const pkgs = [this.setPackage(res['included'])][0];

    let selectedPkgIds: any[] = [];
    pkgs.value.forEach(pkg => {
      selectedPkgIds.push(pkg['package-id'].toString());
      pkg['isPercentage'] = pkg['discount-percentage'] === 0 ? 'false' : 'true';
    });

    const offset = moment().utcOffset();

    this.voucherForm = this.fb.group({
      packagesId: [selectedPkgIds],
      voucherId: res.data.id,
      packages: pkgs,
      voucherCode: res.data.attributes['code'],
      validStartDate: [moment.utc(res.data.attributes['validity-start-date-and-time-utc']).utcOffset(offset).format()],
      validEndDate: [moment.utc(res.data.attributes['validity-end-date-and-time-utc']).utcOffset(offset).format()],
    })
  }

  public getPackage(id: any): string {
    return this.listOfPackages.filter(x => x.id == id)[0];
  }

  public removePackage(id: number): void {
    const pkgs = <FormArray>this.voucherForm.get('packages') as FormArray;
    pkgs.removeAt(pkgs.value.findIndex(x => x['package-id'] === +id));
  }

  public selectPackage(event: any): void {
    const pkgs = <FormArray>this.voucherForm.get('packages') as FormArray;

    //manually remove all packages
    for (let i = 0; i < 3; i++) {
      pkgs.removeAt(pkgs.value.findIndex(x => x['package-id'] === i));
    }

    pkgs.reset();

    event.forEach(id => {
      let newPkg: any = {
        'discount-percentage': 0,
        'discount-amount': 1,
        'redemptions': 1,
        'package-id': +id,
        'status-id': 2,
        'package-availability-id': 1,
        'isPercentage': 'false'
      }

      pkgs.push(this.fb.group(newPkg));
    });
  }

  public onPackageChange(event: any): void {
    const voucherCodes = <FormArray>this.voucherForm.get('voucherCodes') as FormArray;

    if (event.checked) {
      voucherCodes.push(new FormControl(event.source.value))
    } else {
      const i = voucherCodes.controls.findIndex(x => x.value === event.source.value);
      voucherCodes.removeAt(i);
    }
  }

  public updateVoucher(): void {
    //voucher payload
    const data: any = {
      'data': {
        'attributes': {
          'validity-start-date-and-time-utc': moment(this.voucherForm.get('validStartDate').value).format(),
          'validity-end-date-and-time-utc': moment(this.voucherForm.get('validEndDate').value).format(),
          'code': this.voucherForm.get('voucherCode').value,
          'voucher-package-list': this.voucherForm.get('packages').value
        },
        "type": "vouchers"
      }
    };

    data['data']['attributes']['voucher-package-list'].map(v => {
      v.isPercentage = v.isPercentage === 'true';
      return v;
    });

    console.log('data: ', data);

    this.voucherService.updateVoucher(data, this.route.snapshot.params['id']).subscribe(res => {
      if (res)
        this.router.navigateByUrl('app/vouchers');
    })
  }

  public getPackages(): void {
    this.packagesService.listAll().subscribe((result: any) => {
      this.listOfPackages = result.data.filter((_package: any) => !_package.attributes['web-only']);
    });
  }

  public onDiscountChange(event: any, pkg: any): void {
    if (event.value === 'true') {
      pkg.get('isPercentage').patchValue('true');
      pkg.get('discount-percentage').patchValue(pkg.get('discount-amount').value);
      pkg.get('discount-amount').patchValue(0);
    } else {
      pkg.get('isPercentage').patchValue('false');
      pkg.get('discount-amount').patchValue(pkg.get('discount-percentage').value);
      pkg.get('discount-percentage').patchValue(0);
    }
  }

}
