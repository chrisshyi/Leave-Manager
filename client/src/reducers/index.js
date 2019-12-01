import auth from './auth';
import leaves from './leaves';
import personnel from './personnel';
import modals from './modals';
import { combineReducers } from 'redux';

export default combineReducers({
    auth,
    leaves,
    personnel,
    modals
});