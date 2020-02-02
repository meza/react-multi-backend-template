import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { App } from './App';
import React from 'react';

describe('The app component', () => {

  test('it renders consistently', async () => {
    let component: ReactTestRenderer | null = null;

    await act(async () => {
      component = TestRenderer.create(<App/>);
    });

    expect(component).not.toBeNull();

    if (component) {
      expect((component as ReactTestRenderer).toJSON()).toMatchSnapshot();
    }
  });
});
