import { ServicesPackagesModule } from './services-packages.module';

describe('ServicesPackagesModule', () => {
  let servicesPackagesModule: ServicesPackagesModule;

  beforeEach(() => {
    servicesPackagesModule = new ServicesPackagesModule();
  });

  it('should create an instance', () => {
    expect(servicesPackagesModule).toBeTruthy();
  });
});
