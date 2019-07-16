import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'mazaya-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AlertModalComponent implements OnInit {

  @Input() modalId: string;

  @Input() closeButton: boolean = true;

  constructor() {}

  ngOnInit() {}

}
