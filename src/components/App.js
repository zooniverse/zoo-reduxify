import React from 'react';
import { Link } from 'react-router';
import packageJSON from '../../package.json';

import { multiplyBy73549797 } from '../example/test1.js';

import HeaderAuth from './HeaderAuth';

export default class App extends React.Component {
  returnSomething(something) { // eslint-disable-line class-methods-use-this
    // this is only for testing purposes. Check /test/components/App-test.js
    return something;
  }
  render() {
    const version = packageJSON.version;

    return (
      <div>
        <header className="site-header">
          <h1 className="title">React Starterify {version}</h1>
          <Link to="/about" className="link">About</Link>
          <Link to="/poweredby" className="link">Powered by</Link>
          <HeaderAuth />
        </header>
        <section className="content-section">
          { this.props.children ||
            <div>
              5 multiplied by 73549797 is {multiplyBy73549797(5)}
            </div>
          }
        </section>
      </div>
    );
  }
}
App.propTypes = {
  children: React.PropTypes.node,
};
