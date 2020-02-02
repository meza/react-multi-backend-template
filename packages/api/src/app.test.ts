/* eslint-disable no-console */
import cors from 'cors';
import express from 'express';
import { getApp } from './app';

jest.mock('cors');
jest.mock('express');

const mockCors = cors as jest.Mocked<any>;
const mockExpress = express as jest.Mocked<any>;
const mockUse = jest.fn();
const mockGet = jest.fn();

describe('The app server wiring', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockExpress.mockImplementation(() => {
      return {
        use: mockUse,
        get: mockGet
      };
    });
  });
  describe('when configuring the app server', () => {
    test('it sets up CORS', () => {
      const corsResponse = jest.fn();
      mockCors.mockReturnValueOnce(corsResponse);

      getApp();
      expect(mockUse).toHaveBeenCalledWith(corsResponse);
      expect(mockCors).toHaveBeenCalledTimes(1);
    });

    test('it sets up the correct amount of get paths', () => {
      getApp();
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });
  describe('The root route', () => {
    test('it sends a hello world', () => {
      getApp();
      const routeHandler = mockGet.mock.calls[0][1];

      const responseCallback = {
        send: jest.fn()
      };

      routeHandler({}, responseCallback);

      expect(responseCallback.send).toHaveBeenCalledTimes(1);
      expect(responseCallback.send).toHaveBeenCalledWith('Hello World');
    });
  });
});
