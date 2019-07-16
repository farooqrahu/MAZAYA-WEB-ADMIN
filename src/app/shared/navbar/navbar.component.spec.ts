import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { Title } from '@angular/platform-browser';

describe('Component: Navbar', () => {
	let component: NavbarComponent;
	let fixture: ComponentFixture<NavbarComponent>;
	let titleService: Title;

	beforeEach(async(() => {
		TestBed.configureTestingModule(
			{
				declarations: [ NavbarComponent ],
				providers: [Title]
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NavbarComponent);
		component = fixture.componentInstance;
		titleService = TestBed.get(Title);
		fixture.detectChanges();
	});

	it('should create an instance of NavbarComponent', () => {
		expect(component).toBeTruthy();
	});

	it('should return a default title if none is given', () => {
		expect(component.getTitle()).toBe('Mazaya :: Admin');
	});

	it('should return a non-prefixed title if one is given', () => {
		titleService.setTitle('Mazaya :: TestTitle');
		expect(component.getTitle()).toBe('TestTitle');
	})
});
