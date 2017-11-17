// A smart component that handles state for the LoginButton and LoggedInUser
// components. Stores state in Redux.

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SignedInUserNavigation, SignedOutUserNavigation, LogoutButton } from 'zooniverse-react-components';
import { checkLoginUser, loginToPanoptes, logoutFromPanoptes } from '../ducks/login';

class AuthContainer extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    if (!props.initialised) {
      props.dispatch(checkLoginUser());
    }
  }

  login() {
    return this.props.dispatch(loginToPanoptes());
  }

  logout() {
    this.props.dispatch(logoutFromPanoptes());
  }

  render() {
    let userMenuNavItems;
    if (this.props.user && this.props.initialised) {
      const userLogin = this.props.user.login;
      userMenuNavItems = [
        <a href={`https://www.zooniverse.org/users/${userLogin}`}>Profile</a>,
        <a href="https://www.zooniverse.org/settings">Settings</a>,
        <a href={`https://www.zooniverse.org/collections/${userLogin}`}>Collections</a>,
        <a href={`https://www.zooniverse.org/favorites/${userLogin}`}>Favorites</a>,
        <LogoutButton logout={this.logout} />
      ];
    }
    return (this.props.user && this.props.initialised) ?
      <SignedInUserNavigation user={this.props.user} logout={this.logout} userMenuNavList={userMenuNavItems} /> :
      <SignedOutUserNavigation useOauth={true} login={this.login} toggleModal={this.login} />;
  }
}

AuthContainer.defaultProps = {
  dispatch: () => {}
};

AuthContainer.propTypes = {
  user: PropTypes.shape({ login: PropTypes.string }),
  initialised: PropTypes.bool,
  dispatch: PropTypes.func
};

AuthContainer.defaultProps = {
  user: null,
  initialised: false
};

const mapStateToProps = (state) => ({
  user: state.login.user,
  initialised: state.login.initialised
});

export default connect(mapStateToProps)(AuthContainer);  // Connects the Component to the Redux Store
