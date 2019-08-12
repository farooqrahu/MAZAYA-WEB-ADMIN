import { AgreementsModule } from './agreements.module';

describe('AgreementsModule', () => {
	let agreementsModule: AgreementsModule;

	beforeEach(() => {
		AgreementsModule = new AgreementsModule();
	});

	it('should create an instance', () => {
		expect(AgreementsModule).toBeTruthy();
	});
});
