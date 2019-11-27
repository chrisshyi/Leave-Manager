import auth from './auth';
import leaves from './leaves';
import { combineReducers } from 'redux';

export default combineReducers({
    auth,
    leaves
});