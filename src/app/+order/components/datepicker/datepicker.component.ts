import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatePickerComponent implements OnInit {
  @Input()
  public label: string;
  @Input()
  public controlName: string;
  @Input()
  public parentForm: FormGroup;

  @ViewChild('calendar', { static: false })
  public calendar: any;

  constructor() { }

  ngOnInit(): void { }

  public openCalendar(event: any) {
    this.calendar.showOverlay(this.calendar.inputfieldViewChild.nativeElement);
    event.stopPropagation();
  }
}
