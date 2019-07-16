import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../../shared/shared.module';

import { DashboardComponent } from './dashboard.component';

describe('Component: Dashboard', () => {
	let component: DashboardComponent;
	let fixture: ComponentFixture<DashboardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule(
			{
				declarations: [ DashboardComponent ],
				imports: [
					BrowserAnimationsModule,
					SharedModule,
					ChartsModule,
					NgxChartsModule ]
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create an instance of DashboardComponent', () => {
		expect(component).toBeTruthy();
	});
});
