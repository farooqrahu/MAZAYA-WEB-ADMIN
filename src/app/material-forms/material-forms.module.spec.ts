import { MaterialFormsModule } from './material-forms.module';

describe('MaterialFormsModule', () => {
  let materialFormsModule: MaterialFormsModule;

  beforeEach(() => {
    materialFormsModule = new MaterialFormsModule();
  });

  it('should create an instance', () => {
    expect(materialFormsModule).toBeTruthy();
  });
});
