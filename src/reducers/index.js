import { combineReducers } from 'redux'

import checkInStatus from './checkInStatus';
import checkinInfo  from './checkinInfo'

export default combineReducers({
    checkInStatus, checkinInfo
});