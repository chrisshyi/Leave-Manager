import {
    LOGOUT,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOAD_PERSONNEL,
    AUTH_FAILURE,
    CLEAR_ERR_MSG
} from "../actions/types";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: false,
    personnel: null,
    errorMsg: ""
};

const resetState = (state, errorMsg) => {
    localStorage.removeItem("token");
    return {
        ...state,
        loading: false,
        token: null,
        isAuthenticated: false,
        personnel: null,
        errorMsg
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
            return resetState(state, 'Authentication failure');
        case LOGIN_FAILURE:
            return resetState(state, 'Login failure');
        case LOGOUT:
            return resetState(state, '');
        case CLEAR_ERR_MSG:
            return {
                ...state,
                errorMsg: ''
            }
        default:
            return state;
    }
}
