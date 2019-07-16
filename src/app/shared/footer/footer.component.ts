import { Component } from '@angular/core';

@Component(
	{
		selector: 'mazaya-footer',
		templateUrl: './footer.component.html',
		styleUrls: [ './footer.component.scss' ]
	})

export class FooterComponent {
	currentDate: Date = new Date();
}
