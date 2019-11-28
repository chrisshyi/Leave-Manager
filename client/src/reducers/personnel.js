import { GET_ALL_PERSONNEL } from "../actions/types";

const initialState = {
    personnel: []
}

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_ALL_PERSONNEL:
            return {
                ...state,
                personnel: payload
            }
        default:
            return state
    }
}