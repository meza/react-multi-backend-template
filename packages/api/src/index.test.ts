import { start } from './appBootstrap';

jest.mock('./appBootstrap');

describe('The app entry point', () => {
  test('it calls the bootstrap', () => {
    jest.requireActual('./index');
    expect(start).toHaveBeenCalledTimes(1);
  });
});
