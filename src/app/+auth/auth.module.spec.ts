import { AuthModule } from './auth.module';

describe('Module: Auth', () => {
	let authModule: AuthModule;

	beforeEach(() => {
		authModule = new AuthModule();
	});

	it('should create an instance of AuthModule', () => {
		expect(authModule).toBeTruthy();
	});
});
