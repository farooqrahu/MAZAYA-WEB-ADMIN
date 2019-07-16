import { UsersModule } from './users.module';

describe('Module: Users', () => {
	let usersModule: UsersModule;

	beforeEach(() => {
		usersModule = new UsersModule();
	});

	it('should create an instance of UsersModule', () => {
		expect(usersModule).toBeTruthy();
	});
});
