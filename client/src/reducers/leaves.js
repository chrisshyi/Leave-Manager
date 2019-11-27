import { GET_TODAY_LEAVES, LEAVE_ERROR } from "../actions/types";

const initialState = {
    leaves: []
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_TODAY_LEAVES:
            return {
                ...state,
                leaves: payload
            };
        default:
            return state;
    }
}
