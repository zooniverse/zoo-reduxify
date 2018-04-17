import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch } from 'react-router-dom';
import { ZooniverseLogo } from 'zooniverse-react-components';

import AuthContainer from '../containers/AuthContainer';
import ClassifierDemo from './classifierDemo';
import AboutLayout from './about';
import Home from './Home';

export default function App() {
  return (
    <div>
      <header className="site-header">
        <Link to="/" className="link"><h1 className="title">Zooniverse Starter Project</h1></Link>
        <Link to="/about" className="link">About</Link>
        <Link to="/classifier-demo" className="link">Classifier Demo</Link>
        <AuthContainer />
        <ZooniverseLogo />
      </header>
      <section className="content-section">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/classifier-demo" component={ClassifierDemo} />
          <Route path="/about" component={AboutLayout} />
        </Switch>
      </section>
    </div>
  );
}

