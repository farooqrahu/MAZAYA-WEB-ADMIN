import { CapacitiesModule } from './capacities.module';

describe('CapacitiesModule', () => {
  let capacitiesModule: CapacitiesModule;

  beforeEach(() => {
    capacitiesModule = new CapacitiesModule();
  });

  it('should create an instance', () => {
    expect(capacitiesModule).toBeTruthy();
  });
});
