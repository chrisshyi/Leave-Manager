import { GET_MONTHLY_LEAVES, GET_TODAY_LEAVES, LEAVE_ERROR } from "../actions/types";

const initialState = {
    todayLeaves: [],
    monthlyLeaves: [],
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
        default:
            return state;
    }
}
