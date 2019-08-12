import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import * as moment from 'moment';

@Component({
  selector: "mazaya-datepicker",
  templateUrl: "./datepicker.component.html",
  styleUrls: ["./datepicker.component.scss"]
})
export class MazayaDatepickerComponent implements OnInit {
  @Input()
  public minDateValue: Date;
  @Input()
  public maxDateValue: Date; 
  @Input()
  public parentForm: FormGroup;
  @Input()
  public controlName: any;
  @Input()
  public label: string;
  @Input()
  public backgroundColor: string;
  @Input()
  public tabindex: number = 0;
  @Input()
  public placeholder: string = 'mm/dd/yyyy';
  @Input()
  public customFormat: string = 'mm/dd/yy';
  @Input()
  public errorText: string = 'Place your customer error text here';
  @Input()
  public inputStyleClass: string = 'bg-color-white';

  @Output()
  public isValid = new EventEmitter<boolean>();

  @ViewChild('calendar', { static: false })
  public calendar: any;

  constructor() {
    moment.locale('en');
  }

  ngOnInit() {
    //string needs to be converted to javascript date before passing it to p-calendar
    if(this.parentForm && this.parentForm.get(this.controlName).value) {
      this.parentForm.get(this.controlName).patchValue(this.localToUtc(new Date(this.parentForm.get(this.controlName).value)));
    }
  }

  private localToUtc(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),  date.getHours(), date.getMinutes(), date.getSeconds()));
  }

  public onChange(event: any): void { 
    this.parentForm.get(this.controlName).setValue(moment(new Date(event)).locale('en').format('MM/DD/YYYY'));
    this.isValid.emit(event)
  }

  public openCalendar(event: any) {
    this.calendar.showOverlay(this.calendar.inputfieldViewChild.nativeElement);
    event.stopPropagation();
  }

  public getYearRange() {
    const currentYear = moment().locale('en').format('YYYY');
    const yearToGo = moment().locale('en').add(30, 'year').format('YYYY');

    const range = currentYear + ':' + yearToGo;
    return range;
  }
}


