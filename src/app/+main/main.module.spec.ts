import { MainModule } from './main.module';

describe('Module: Main', () => {
	let mainModule: MainModule;

	beforeEach(() => {
		mainModule = new MainModule();
	});

	it('should create an instance of MainModule', () => {
		expect(mainModule).toBeTruthy();
	});
});
