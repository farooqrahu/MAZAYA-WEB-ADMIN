import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundComponent } from './page-not-found.component';

describe('Component: PageNotFound', () => {
	let component: PageNotFoundComponent;
	let fixture: ComponentFixture<PageNotFoundComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule(
			{
				declarations: [ PageNotFoundComponent ]
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageNotFoundComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create an instance of PageNotFoundComponent', () => {
		expect(component).toBeTruthy();
	});
});
