import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	           selector: 'mazaya-add-button',
	           templateUrl: './add-button.component.html',
	           styleUrls: [ './add-button.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated
           })
export class AddButtonComponent implements OnInit {

	@Input('title') title: string;
	@Input('link') link: string[];
	@Input('backButton') backButton: boolean = false;
	@Input('backButtonLink') backButtonLink: string[] = [ '..' ];

	constructor () { }

	ngOnInit () {
	}

}
