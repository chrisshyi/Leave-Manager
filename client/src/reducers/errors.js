import { SET_ERR_MSG, CLEAR_ERR_MSG } from '../actions/types';

const initialState = {
    errMsg: ''
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_ERR_MSG:
            return {
                ...state,
                errMsg: action.payload
            };
        case CLEAR_ERR_MSG:
        default:
            return initialState;
    }
}