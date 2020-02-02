/* eslint-disable no-console */
import { getApp } from './app';
import { start } from './appBootstrap';

jest.mock('./app');

const mockApp = getApp as jest.Mocked<any>;
const mockListen = jest.fn();
const mockOn = jest.fn();

describe('The application entry', () => {

  beforeEach(() => {
    jest.resetAllMocks();
    mockApp.mockImplementation(() => {
      return {
        on: mockOn,
        listen: mockListen
      };
    });

    delete process.env.PORT;
  });

  describe('when booting up', () => {
    describe('and the port is not explicitly set', () => {
      test('it uses the default port', () => {
        start();
        expect(mockListen).toHaveBeenCalledTimes(1);
        expect(mockListen).toHaveBeenCalledWith(
          {
            port: 3000
          },
          expect.any(Function)
        );
      });
      test('it sets up socket timeout', () => {
        start();
        expect(mockOn).toHaveBeenCalledTimes(1);
        expect(mockOn).toHaveBeenCalledWith('connection', expect.any(Function));
        const onConnectCallback = mockOn.mock.calls[0][1];
        const mockSetTimeOut = jest.fn();
        const mockSocket = {
          setTimeout: mockSetTimeOut
        };

        onConnectCallback(mockSocket);

        expect(mockSetTimeOut).toHaveBeenCalledWith(0);

      });
    });
    describe('and the port is set', () => {
      test('it starts listening on the specified port', () => {
        const port = 5000;
        process.env.PORT = `${port}`;

        start();
        expect(mockListen).toHaveBeenCalledTimes(1);
        expect(mockListen).toHaveBeenCalledWith(
          {
            port: port
          },
          expect.any(Function)
        );

      });
    });
    describe('and it encounters a failure', () => {
      test('it logs the correct thing', () => {
        console.trace = jest.fn();
        const error = new Error('Dummy Error');
        mockListen.mockImplementation(() => {
          throw error;
        });

        start();

        expect(console.trace).toHaveBeenCalledTimes(1);
        expect(console.trace).toHaveBeenCalledWith(error);
      });
    });
    test('it logs the correct thing', () => {
      console.log = jest.fn();
      process.env.PORT = '6000';
      start();

      const callbackUnderTest = mockListen.mock.calls[0][1];
      callbackUnderTest();

      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('🚀 Server ready at http://localhost:6000');
    });
  });
});
