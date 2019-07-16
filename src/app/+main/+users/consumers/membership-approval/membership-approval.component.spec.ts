import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipApprovalComponent } from './membership-approval.component';

describe('Component: MembershipApproval', () => {
	let component: MembershipApprovalComponent;
	let fixture: ComponentFixture<MembershipApprovalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule(
			{
				declarations: [ MembershipApprovalComponent ]
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MembershipApprovalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create an instance of MembershipApprovalComponent', () => {
		expect(component).toBeTruthy();
	});
});
