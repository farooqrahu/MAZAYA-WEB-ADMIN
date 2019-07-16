import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { Ng2UiAuthModule } from 'ng2-ui-auth';
import { authOptions } from '../../shared/config/authOptions';
import { RouterTestingModule } from '@angular/router/testing';
import { appRoutes } from '../../app-routing.module';

describe('Component: Login', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let location: Location;

	beforeEach(async(() => {
		TestBed.configureTestingModule(
			{
				declarations: [ LoginComponent ],
				imports: [
					FormsModule,
					ReactiveFormsModule,
					NgxErrorsModule,
					Ng2UiAuthModule.forRoot(authOptions),
					RouterTestingModule.withRoutes(appRoutes)
				]
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		location = TestBed.get(Location);
		fixture.detectChanges();
	});

	it('should create an instance of LoginComponent', () => {
		expect(component).toBeTruthy();
	});

	it('should allow the user to login with valid credentials', async(() => {}));

	it('should not allow the user to login with invalid credentials', async(() => {}));
});
