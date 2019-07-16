import { VouchersModule } from './vouchers.module';

describe('VouchersModule', () => {
  let vouchersModule: VouchersModule;

  beforeEach(() => {
    vouchersModule = new VouchersModule();
  });

  it('should create an instance', () => {
    expect(vouchersModule).toBeTruthy();
  });
});
