import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './stylesheets/index.scss';
import App from './Components/App/App';

const HotApp = hot(App);
ReactDOM.render(
  (
    <BrowserRouter>
      <HotApp/>
    </BrowserRouter>
  ), document.getElementById('root'));
