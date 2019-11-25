import { LOGIN_SUCCESS, LOGIN_FAILURE, LOAD_PERSONNEL, AUTH_FAILURE } from "../actions/types";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: true,
    personnel: null
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token)
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
                personnel: payload
            };
        case AUTH_FAILURE:
        case LOGIN_FAILURE:
            localStorage.removeItem('token');
            return {
                ...state,
                loading: false,
                token: null,
                isAuthenticated: false,
                personnel: null
            }
        default:
            return state;
    }
}
