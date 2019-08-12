import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementAddComponent } from './agreement-add.component';

describe('VoucherAddComponent', () => {
	let component: AgreementAddComponent;
	let fixture: ComponentFixture<AgreementAddComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AgreementAddComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AgreementAddComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
