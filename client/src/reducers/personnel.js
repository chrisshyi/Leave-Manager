import { GET_PERSONNEL_LEAVES, GET_ALL_PERSONNEL } from "../actions/types";

const initialState = {
    allPersonnel: [],
    personnelLeaves: {}
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_ALL_PERSONNEL:
            return {
                ...state,
                allPersonnel: payload
            };
        case GET_PERSONNEL_LEAVES:
            return {
                ...state,
                personnelLeaves: payload
            };
        default:
            return state;
    }
}
