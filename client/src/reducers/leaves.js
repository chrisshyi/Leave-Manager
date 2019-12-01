import { GET_AVAILABLE_LEAVES, GET_MONTHLY_LEAVES, GET_TODAY_LEAVES, LEAVE_ERROR } from "../actions/types";

const initialState = {
    todayLeaves: [],
    monthlyLeaves: [],
    availableLeaves: {
        personnel: null,
        leaves: [] 
    }
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_TODAY_LEAVES:
            return {
                ...state,
                todayLeaves: payload
            };
        case GET_MONTHLY_LEAVES:
            return {
                ...state,
                monthlyLeaves: payload
            }
        case GET_AVAILABLE_LEAVES:
            return {
                ...state,
                availableLeaves: {
                    personnel: payload.personnel,
                    leaves: payload.leaves
                }
            }
        case LEAVE_ERROR:
            return initialState;
        default:
            return state;
    }
}
