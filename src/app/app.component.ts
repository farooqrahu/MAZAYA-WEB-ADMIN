import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer, Title } from '@angular/platform-browser';
import {
	ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent
} from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { SpinnerComponent } from './app-components/spinner/spinner.component';

@Component(
	{
		selector: 'mazaya-root',
		templateUrl: './app.component.html',
		styleUrls: [ './app.component.scss' ]
	})
export class AppComponent implements OnInit {

	public spinnerComponent = SpinnerComponent;

	showRouteTransitionLoader = false;

	// noinspection TsLint
	constructor (private router: Router, private titleService: Title, private activatedRoute: ActivatedRoute,
	             private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
		router.events.subscribe((event: RouterEvent) => {
			this.interceptRouteChangeEvent(event);
		});
	}

	interceptRouteChangeEvent (event: RouterEvent): void {
		if ( event instanceof NavigationStart ) {
			this.showRouteTransitionLoader = true;
		}
		if ( event instanceof NavigationEnd ) {
			this.showRouteTransitionLoader = false;
		}
		if ( event instanceof NavigationCancel ) {
			this.showRouteTransitionLoader = false;
		}
		if ( event instanceof NavigationError ) {
			this.showRouteTransitionLoader = false;
		}
	}

	ngOnInit () {
		this.router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map(() => this.activatedRoute),
			map((route) => {
				while ( route.firstChild ) {
					route = route.firstChild;
				}
				return route;
			}),
			filter((route) => route.outlet === 'primary'),
			mergeMap((route) => route.data)
		).subscribe((event) => {
			if ( event[ 'title' ] ) {
				this.titleService.setTitle('Mazaya :: ' + event[ 'title' ]);
			}
		});

		this.iconRegistry.addSvgIcon('delete_outline', this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/svg/delete_outline.svg'));
		this.iconRegistry.addSvgIcon('add_circle_outline', this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/svg/add_circle_outline.svg'));
	}
}
