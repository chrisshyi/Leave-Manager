import axios from "axios";
import { LOGOUT, LOGIN_SUCCESS, LOAD_PERSONNEL, LOGIN_FAILURE, AUTH_FAILURE } from "./types";
import setAuthToken from "../utils/setAuthToken";

const loadPersonnel = () => async dispatch => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    try {
        const res = await axios.get("/api/auth");
        dispatch({
            type: LOAD_PERSONNEL,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: AUTH_FAILURE
        });
    }
};

export const login = (email, password) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const body = JSON.stringify({ email, password });
        const res = await axios.post("/api/auth", body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadPersonnel());
    } catch (error) {
        dispatch({
            type: LOGIN_FAILURE
        });
    }
};

export const logout = () => async dispatch => {
    dispatch({
        type: LOGOUT
    })
}