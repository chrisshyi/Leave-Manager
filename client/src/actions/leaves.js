import {
    SCHEDULE_LEAVE,
    GET_AVAILABLE_LEAVES,
    GET_MONTHLY_LEAVES,
    GET_TODAY_LEAVES,
    LEAVE_ERROR,
    LOGOUT
} from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

export const getTodayLeaves = () => async dispatch => {
    try {
        const token = localStorage.getItem("token");
        console.log(`Token: ${token}`);
        if (token === null) {
            return;
        }
        if (!axios.defaults.headers.common.hasOwnProperty("x-auth-token")) {
            setAuthToken(token);
        }
        const today = new Date();
        const res = await axios.get(
            `/api/leaves/?year=${today.getFullYear()}
            &month=${today.getMonth() + 1}
            &day=${today.getDate()}`
        );
        console.log(res.data);
        dispatch({
            type: GET_TODAY_LEAVES,
            payload: res.data
        });
    } catch (error) {
        if (error.response.data.msg === "Token expired!") {
            dispatch({
                type: LOGOUT
            });
        } else {
            dispatch({
                type: LEAVE_ERROR
            });
        }
    }
};

export const getMonthlyLeaves = (year, month) => async dispatch => {
    try {
        const token = localStorage.getItem("token");
        console.log(`Token: ${token}`);
        if (token === null) {
            return;
        }
        if (!axios.defaults.headers.common.hasOwnProperty("x-auth-token")) {
            setAuthToken(token);
        }
        const res = await axios.get(
            `/api/leaves/?year=${year}
            &month=${month}`
        );
        console.log(res.data);
        dispatch({
            type: GET_MONTHLY_LEAVES,
            payload: res.data
        });
    } catch (error) {
        if (error.response.data.msg === "Token expired!") {
            dispatch({
                type: LOGOUT
            });
        } else {
            dispatch({
                type: LEAVE_ERROR
            });
        }
    }
};

export const getAvailableLeaves = personnel => async dispatch => {
    try {
        const res = await axios.get(`/api/leaves/available/${personnel._id}`);
        dispatch({
            type: GET_AVAILABLE_LEAVES,
            payload: res.data
        });
    } catch (error) {
        if (error.response.data.msg === "Token expired!") {
            dispatch({
                type: LOGOUT
            });
        } else {
            dispatch({
                type: LEAVE_ERROR
            });
        }
    }
};

export const scheduleLeave = (leaveId, scheduledDate) => async dispatch => {
    console.log(`leaveId : ${leaveId}`);
    if (leaveId === '' || typeof leaveId === 'undefined') return;
    try {
        const leaveData = {
            scheduled: true,
            scheduledDate
        };
        const res = await axios.put(`/api/leaves/${leaveId}`, leaveData);
        getMonthlyLeaves(scheduledDate.year(), scheduledDate.month() + 1);
    } catch (error) {
        console.log(error);
        if (error.response.data.msg === "Token expired!") {
            dispatch({
                type: LOGOUT
            });
        } else {
            dispatch({
                type: LEAVE_ERROR
            });
        }
    }
};
