import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { PackagesService } from 'app/services/api/packages/packages.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { VouchersService } from 'app/services/api/vouchers/vouchers.service';
import * as moment from 'moment';
import { VoucherPackage } from 'app/models/package.model';
import * as _ from 'lodash';
import * as XLSX from 'ts-xlsx';
import { Router } from '@angular/router';

@Component({
  selector: 'mazaya-voucher-add',
  templateUrl: './voucher-add.component.html',
  styleUrls: ['./voucher-add.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class VoucherAddComponent implements OnInit {
  public listOfPackages: any;
  public voucherForm: FormGroup;
  public fileContent: any;
  public voucherCodes: string[] = [];
  public checkedCodes: any[] = [];
  public showMFPackage: boolean = false;
  public selectedPackages: any[] = [];
  selectedVoucherOptions = '';

  constructor(private router: Router, private voucherService: VouchersService, public fb: FormBuilder, private packagesService: PackagesService) {

    this.voucherForm = fb.group(
      {
        voucherCount: [1],
        packagesId: [null, Validators.compose([Validators.required])],
        packages: new FormArray([]),
        voucherCodes: new FormArray([]),
        validStartDate: [moment().format(), Validators.compose([Validators.required])],
        validEndDate: [moment().format(), Validators.compose([Validators.required])],
      }
    );
  }

  ngOnInit() {
    this.getPackages();
  }

  public onResetFile(): void {
    this.voucherCodes = [];
  }

  public onVoucherChange(event: any): void {
    const voucherCodes = <FormArray>this.voucherForm.get('voucherCodes') as FormArray;

    if (event.checked) {
      voucherCodes.push(new FormControl(event.source.value))
    } else {
      const i = voucherCodes.controls.findIndex(x => x.value === event.source.value);
      voucherCodes.removeAt(i);
    }
  }

  public getPackage(id: any): any {
    return this.listOfPackages.filter(x => x.id == id)[0];
  }

  public removePackage(id: number): void {
    const pkgs = <FormArray>this.voucherForm.get('packages') as FormArray;
    pkgs.removeAt(pkgs.value.findIndex(x => x['package-id'] === +id));
  }

  public selectPackage(event: any, form: any): void {
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
      };
      pkgs.push(this.fb.group(newPkg));
    });
  }

  public genVoucherCode(len: number, an: string): string {
    an = an && an.toLowerCase();
    let str = "", i = 0, min = an == "a" ? 10 : 0, max = an == "n" ? 10 : 62;
    for (; i++ < len;) {
      let r = Math.random() * (max - min) + min << 0;
      str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
    }
    return str.toUpperCase();
  }

  public parseFileToArray(event: any): void {
    const fileReaded = event.target.files[0];
    const extension = fileReaded.name.split('.')[1];

		let reader: FileReader = new FileReader();
    if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
			reader.onload = () => {
				const result: any = reader.result;
				const data = new Uint8Array(result);
				const arr = [];
				for(let i = 0; i != data.length; ++i) {
					arr[i] = String.fromCharCode(data[i]);
				}
				const bstr = arr.join('');
				const workbook: any = XLSX.read(bstr, { type: 'binary' });
				this.voucherCodes = [];
				for (const sheet in workbook.Sheets) {
					for (const string in workbook.Sheets[sheet]) {
						if (string !== '!ref\n') {
							const v = workbook.Sheets[sheet][string].v;
							if (v) {
								const allTextLines = v.split(/\r|\n|\r/);
								const headers = allTextLines[0].split(',');
								for (const key in allTextLines) {
									const data = allTextLines[key].split(',');
									if (data.length === headers.length) {
										for (const i in headers) {
											if (data[i].length > 0) {
												this.voucherCodes.push(data[i]);
											}
										}
									}
								}
							}
						}
					}
				}
			};
			reader.readAsArrayBuffer(fileReaded);
		} else {
			reader.readAsText(fileReaded);
			reader.onload = () => {
				const result: any = reader.result;
				const allTextLines = result.split(/\r|\n|\r/);
				const headers = allTextLines[0].split(',');
				this.voucherCodes = [];
				for (const key in allTextLines) {
					const data = allTextLines[key].split(',');
					if (data.length === headers.length) {
						for (const i in headers) {
							if (data[i].length > 0) {
								this.voucherCodes.push(data[i]);
							}
						}
					}
				}
			}
		}
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

  public createVoucher(): void {
    //generate voucher
    if (!this.voucherCodes.length) {
      alert('Please generate a voucher or upload a file');
      return;
    }

    //voucher payload
    const data: any = {
      "data": {
        "attributes": {
          "validity-start-date-and-time-utc": moment(this.voucherForm.get('validStartDate').value).format(),
          "validity-end-date-and-time-utc": moment(this.voucherForm.get('validEndDate').value).format(),
					"codes": this.voucherCodes,
          "voucher-package-list": this.voucherForm.get('packages').value
        },
        "type": "vouchers",
        "relationships": {
          "agreement": {
            "data": {
              "type": "agreements",
              "id": 1
            }
          }
        }
      }
    };

    data['data']['attributes']['voucher-package-list'].map(v => {
    	v.isPercentage = v.isPercentage === 'true';
    	return v;
		});

    this.voucherService.createVoucher(data).subscribe(res => {
      if (res)
        this.router.navigateByUrl('app/vouchers');
    })
  }

  public getPackages(): void {
    this.packagesService.listAll().subscribe((result: any) => {
      this.listOfPackages = result.data.filter((_package: any) => !_package.attributes['web-only']);
      this.selectFirstPackage();
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

  public selectFirstPackage(): void {
    setTimeout(() => {
      const firstPackage = this.listOfPackages.filter(x => x.id === this.listOfPackages[0].id)[0];
      const packagesFormArray = <FormArray>this.voucherForm.get('packages') as FormArray;

      this.voucherForm.get('packagesId').patchValue([this.listOfPackages[0].id]);

      const defaultPackage = {
        "discount-percentage": 0,
        "discount-amount": 1,
        "redemptions": 1,
        "package-id": +firstPackage.id,
        "status-id": 2,
        "package-availability-id": 1,
        "isPercentage": 'false'
      }
      packagesFormArray.push(this.fb.group(defaultPackage));
    });
  }

  onSelect(ev) {
  	this.voucherCodes = [];
  	this.selectedVoucherOptions = ev.value;
	}

	onNumberInputChange(ev) {
		if (ev.target.value < 0) {
			ev.target.value = 0;
		}
		return ev;
	}

	onNumberVoucherChange(ev) {
		this.voucherCodes = [];

		ev = this.onNumberInputChange(ev);

		for (let i = 0; i < ev.target.value; i++) {
			this.voucherCodes.push(`${this.genVoucherCode(4, 'A')}${this.genVoucherCode(3, 'N')}`);
		}
	}

	bindHtmlVoucherCode() {
  	if (this.voucherCodes.length) {
			let html = '';
			let newColCount = 10;
			this.voucherCodes.forEach ((vc, idx) => {
				if (idx === newColCount) {
					html += '</div>';
				}
				if (idx === 0 || idx === newColCount) {
					if (idx !== 0) {
						newColCount = newColCount + 10;
					}
					html += '<div class="col-4 mt-2">';
				}
				html += `<p class="text-center">${vc}</p>`;
			});
			if (this.voucherCodes.length < newColCount) {
				html += '</div>';
			}

  		return html
		} else {
  		return '';
		}
	}
}
