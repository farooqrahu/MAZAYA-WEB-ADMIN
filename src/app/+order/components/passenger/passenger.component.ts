import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { OrderService, MyOrderService } from 'app/+order/services/order.service';
import { map } from 'rxjs/operators';
import { includes, sortBy } from 'lodash';
import { ProgressIndex } from 'app/+order/models/order.model';
import * as moment from 'moment';

export const getFileType = (str: string) => {
  const type = str.split(';')[0].split('/')[1] || str.split('.').pop();
  return type;
};

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.component.html',
  styleUrls: ['./passenger.component.scss']
})
export class PassengerComponent implements OnInit {
  public progressIndex = ProgressIndex;
  public defaultNationality: string = 'Saudi, Saudi Arabian';
  public defaultDialCode: string = '+966';
  public salutations: any[] = [
    {
      value: 'Mr.',
      label: 'Mr.'
    }, {
      value: 'Ms.',
      label: 'Ms.'
    }, {
      value: 'Mrs.',
      label: 'Mrs.'
    }
  ];
  public passengerForm: FormGroup;
  public nationalities$: Observable<any>;
  public dialCodes$: Observable<any>;
  public minDateValue: Date = new Date();

  constructor(private orderService: OrderService, private fb: FormBuilder, private myOrderService: MyOrderService) {
    this.myOrderService.setProgressIndex(this.progressIndex.passenger);
    this.myOrderService.setProgressLine(this.progressIndex.passenger);

    this.passengerForm = this.fb.group({
      members: new FormArray([])
    });

    this.nationalities$ = this.getNationality;
    this.dialCodes$ = this.getDialCodes;

    this.passengerForm.valueChanges.subscribe(res => {
      if (this.passengerForm.valid && this.checkFormsAreValid) {
        this.myOrderService.setPassengers(this.passengerForm);
        localStorage.setItem('waPassengers', JSON.stringify(this.passengerForm.value));
      } else {
        this.myOrderService.setPassengers(null);
      }
    })

    this.getCachedPassengers.subscribe(passengers => {
      if (passengers) {
        const members = this.passengerForm.get('members') as FormArray;
        passengers.members.forEach(element => {
          members.push(this.fb.group(element));
        });
      } else {
        const members = this.passengerForm.get('members') as FormArray;
        members.push(this.createMembers);
      }
    })

  }

  ngOnInit(): void { }

  public get getCachedPassengers(): Observable<any> {
    return of(JSON.parse(localStorage.getItem('waPassengers'))) || this.myOrderService.psngrs$;
  }

  public get createMembers() {
    return this.fb.group({
      salutation: ['Mr.', Validators.compose([Validators.required])],
      'id': ['', Validators.compose([])],
      'first-name': ['', Validators.compose([Validators.required])],
      'last-name': ['', Validators.compose([Validators.required])],
      'nationality': [this.defaultNationality, Validators.compose([Validators.required])],
      'passport-expiry-date': [null, Validators.compose([Validators.required])],
      'passport-scan': [null, Validators.compose([Validators.required])],
      'is-booker': [false, Validators.compose([])],
      'dialCode': [this.defaultDialCode, Validators.compose([Validators.required])],
      'mobile': [''],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  public get getMembers(): FormArray {
    return <FormArray>this.passengerForm.get('members')['controls'];
  }

  public get getPsngrFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem('waPassengers')) || null;
  }

  public salutationChange(event: any, member: any): void { }

  public onNationalityChange(event: any, form: FormGroup): void {
    form.get('nationality').setValue(event);
  }

  public get isSelectionFastTack(): boolean {
    return JSON.parse(localStorage.getItem('waSelectedPackage')) ? JSON.parse(localStorage.getItem('waSelectedPackage')).id == 2 : false;
  }

  public onDialCodeChange(value: string, member: FormGroup): void {
    member.get('dialCode').setValue(value);
  }

  public get checkFormsAreValid(): boolean {
    const members = (<FormArray>this.passengerForm.get('members')).controls;
    let isValid: boolean = true;

    if (members.length > 0) {
      members.forEach((member: FormGroup) => {
        const expiry = member.get('passport-expiry-date');
        const nationality = member.get('nationality');
        const mobile = member.get('mobile');

        //check if passport is less than 3/6 months from set expiry date
        Object.keys(member.controls).forEach((key: string) => {
          if (key === 'passport-expiry-date') {
            if ((expiry.value && nationality.value) && this.isPassportExpiryValid(expiry.value, nationality.value) === false) {
              expiry.setErrors({ 'incorrect': true });
              isValid = false;
              return false;
            }
          }

          if (key === 'mobile') {
            if (!mobile.value) {
              mobile.setErrors({ 'incorrect': true });
              isValid = false;
              return false;
            }
          }
        });
        member.markAsDirty();

        if (member.status === 'INVALID') {
          isValid = false;
        }
      });
    } else {
      isValid = false;
    }
    return true;
  }

  public isPassportExpiryValid(expiry, nationality): boolean {
    const ksaGcc = ['Saudi, Saudi Arabian', 'Kuwaiti', 'Emirati, Emirian, Emiri', 'Qatari', 'Bahraini', 'Omani'];
    expiry = moment(expiry);
    const now = moment();
    const isExpired = moment(expiry).isBefore(now);

    if (isExpired) return false;

    let endDate;
    let isValid: boolean = true;
    const isKsaGcc = includes(ksaGcc, nationality);
    if (isKsaGcc) {
      endDate = moment().add(3, 'months');
      isValid = moment(expiry).isAfter(endDate);
    } else {
      endDate = moment().add(6, 'months');
      isValid = moment(expiry).isAfter(endDate);
    }
    return isValid;
  }

  public onRemove(index: number): void {
    const members = this.passengerForm.get('members') as FormArray;
    members.removeAt(index);
  }

  public addMember(): void {
    const members = this.passengerForm.get('members') as FormArray;
    members.push(this.createMembers);
  }

  public get getNationality(): Observable<any> {
    return this.orderService.getNationalities().pipe(map(items => items.data), map(items => {
      let formattedItems: any = [];
      items.forEach(item => {
        formattedItems.push({
          label: item.attributes['nationality-name'],
          value: item.attributes['nationality-name']
        })
      });
      return sortBy(formattedItems, 'value');
    }));
  }

  public get getDialCodes(): Observable<any> {
    return this.orderService.getNationalities().pipe(map(items => items.data), map(items => {
      let formattedItems: any = [];
      items.forEach(item => {
        formattedItems.push({
          label: `${item.attributes['dial-code']} - ${item.attributes['nationality-name']}`,
          value: item.attributes['dial-code'],
          nationality: item.attributes['nationality-name']
        })
      });
      return sortBy(formattedItems, 'value');
    }));
  }

  public triggerPassportScanFileSelect(el: any) {
    el.click();
  }

  public onPassportScanSelect($event, member: FormGroup) {
    const file = $event.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt: any) => {
      file.preview = evt.target.result;
      member.get('passport-scan').setValue(file);
      $event.target.value = '';
    };

    reader.readAsDataURL(file);
  }

  public getPassportScanFileType(member): string {
    if (member.get('passport-scan').value !== null) {
      const passportScan = member.get('passport-scan').value.preview ? member.get('passport-scan').value.preview : member.get('passport-scan').value;
      if (passportScan) {
        return getFileType(passportScan);
      }
    }
  }
}
