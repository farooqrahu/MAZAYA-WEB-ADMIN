import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-reseller-dialog',
  templateUrl: './reseller-dialog.component.html',
  styleUrls: ['./reseller-dialog.component.scss']
})
export class ResellerDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ResellerDialogComponent>) { }

  ngOnInit(): void { }
}
