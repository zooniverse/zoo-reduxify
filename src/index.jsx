import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import oauth from 'panoptes-client/lib/oauth';

import App from './components/App';
import config from './config';
import configureStore from './store';

import './styles/main.styl';

const store = configureStore();
const history = createHistory();

oauth.init(config.panoptesAppId)
  .then(() => {
    ReactDOM.render((
      <Provider store={store}>
        <HashRouter history={history}>
          <Route path="/" component={App} />
        </HashRouter>
      </Provider>),
      document.getElementById('root'),
    );
  });
