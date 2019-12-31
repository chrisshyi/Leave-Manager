import axios from "axios";
import {
    CLEAR_ERR_MSG,
    LOGOUT,
    LOGIN_SUCCESS,
    LOAD_PERSONNEL,
    LOGIN_FAILURE
} from "./types";
import setAuthToken from "../utils/setAuthToken";
import { setErrMsg } from "./errors";

const ERR_MSG_DURATION = 3000;

export const loadPersonnel = () => async dispatch => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    } else {
        return;
    }
    try {
        const res = await axios.get("/api/auth");
        dispatch({
            type: LOAD_PERSONNEL,
            payload: res.data
        });
    } catch (error) {
        console.log(error);
        if (error.response.data.msg === "Token expired!") {
            dispatch({
                type: LOGOUT
            });
        }
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
        console.log(error.response);
        if (error.response) {
            if (error.response.data.hasOwnProperty("error")) {
                dispatch(setErrMsg(error.response.data.error.msg));
            }
        }
    }
};

export const logout = () => async dispatch => {
    dispatch({
        type: LOGOUT
    });
};
