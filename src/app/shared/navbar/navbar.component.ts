import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component(
	{
		selector: 'mazaya-navbar',
		templateUrl: './navbar.component.html',
		styleUrls: [ './navbar.component.scss' ]
	})

export class NavbarComponent {

	constructor (private titleService: Title) {}

	getTitle () {
		if ( this.titleService.getTitle() ) {
			return this.titleService.getTitle().replace('Mazaya :: ', '');
		} else {
			return 'Mazaya :: Admin';
		}
	};

}
