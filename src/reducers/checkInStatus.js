import {NOT_CHECKED_IN, CHECK_IN, CHECK_OUT, CHECKED_IN} from '../constants'

const checkInInitialState = [NOT_CHECKED_IN]

const checkInStatus = (state = checkInInitialState, action) => {
    console.log('Action dispatched to checkInStatus Reducer')
    switch (action.type) {
        case CHECK_IN:
            console.log('Check In Case');
            return CHECKED_IN
        case CHECK_OUT:
                console.log('Check Out Case');
                return NOT_CHECKED_IN
        default:
            console.log('Default Case');
            return state;
    }
}

export default checkInStatus;