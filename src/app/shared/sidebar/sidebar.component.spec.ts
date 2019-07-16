import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { appRoutes } from '../../app-routing.module';
import { ChangeLanguageComponent } from '../../app-components/change-language/change-language.component';
import { PageNotFoundComponent } from '../../app-components/page-not-found/page-not-found.component';

describe('Component: Sidebar', () => {
	let component: SidebarComponent;
	let fixture: ComponentFixture<SidebarComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule(
			{
				declarations: [ SidebarComponent, ChangeLanguageComponent, PageNotFoundComponent ],
				imports: [RouterTestingModule.withRoutes(appRoutes)]
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SidebarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create an instance of SidebarComponent', () => {
		expect(component).toBeTruthy();
	});
});
