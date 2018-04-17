import { combineReducers } from 'redux';
import login from './login';
import zooniverseData from './zooniverse-data';

export default combineReducers({
  login,
  zooniverseData,
});
