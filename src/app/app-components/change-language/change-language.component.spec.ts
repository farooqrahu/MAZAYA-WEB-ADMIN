import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLanguageComponent } from './change-language.component';

describe('Component: ChangeLanguage', () => {
	let component: ChangeLanguageComponent;
	let fixture: ComponentFixture<ChangeLanguageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule(
			{
				declarations: [ ChangeLanguageComponent ]
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ChangeLanguageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create an instance of ChangeLanguageComponent', () => {
		expect(component).toBeTruthy();
	});
});
