import {
    LOGOUT,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOAD_PERSONNEL,
    AUTH_FAILURE,
} from "../actions/types";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: true,
    personnel: null,
};

const resetState = state => {
    localStorage.removeItem("token");
    return {
        ...state,
        loading: false,
        token: null,
        isAuthenticated: false,
        personnel: null,
    };
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case LOGIN_SUCCESS:
            localStorage.setItem("token", payload.token);
            return {
                ...state,
                token: payload.token,
                isAuthenticated: true,
                loading: false
            };
        case LOAD_PERSONNEL:
            return {
                ...state,
                loading: false,
                personnel: payload,
                isAuthenticated: true
            };
        case AUTH_FAILURE:
        case LOGIN_FAILURE:
        case LOGOUT:
            return resetState(state, '');
        default:
            return state;
    }
}
