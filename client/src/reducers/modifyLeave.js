import { ADD_OR_DELETE_LEAVE } from '../actions/types';

const initialState = {
    editLeaveDate: null,
    addLeave: true
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ADD_OR_DELETE_LEAVE:
            return {
                ...state,
                editLeaveDate: payload.editLeaveDate,
                addLeave: payload.addLeave
            }
        default:
            return state
    }
}