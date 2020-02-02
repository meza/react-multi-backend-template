import { chance } from 'jest-chance';

jest.mock('dotenv-defaults');

describe('The app config setter upper', () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.LOFASZ;
  });
  describe('when there are env variables', () => {
    test('it ties them to the correct config values', async () => {
      const randomLofasz = chance.hash();

      process.env.LOFASZ = randomLofasz;

      const AppConfig = await import('./appConfig');
      expect(AppConfig.default.lofasz).toEqual(randomLofasz);
    });
  });

  describe('when the env variables are not set', () => {
    test('it adds empty values', async () => {
      const AppConfig = await import('./appConfig');
      expect(AppConfig.default.lofasz).toEqual('');
    });
  });
});
