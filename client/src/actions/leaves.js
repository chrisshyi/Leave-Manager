import {
    ADD_OR_EDIT_LEAVE,
    GET_AVAILABLE_LEAVES,
    GET_MONTHLY_LEAVES,
    GET_TODAY_LEAVES,
    LEAVE_ERROR,
    LOGOUT
} from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import getPersonnelLeaves from './personnel';

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
    if (leaveId === "" || typeof leaveId === "undefined") return;
    try {
        const leaveData = {
            scheduled: true,
            scheduledDate
        };
        const res = await axios.put(`/api/leaves/${leaveId}`, leaveData);
        console.log(scheduledDate);
        console.log(`Calling get monthly leaves with year ${scheduledDate.year()}
        month ${scheduledDate.month() + 1}
        `);
        dispatch(
            getMonthlyLeaves(scheduledDate.year(), scheduledDate.month() + 1)
        );
    } catch (error) {
        console.log(error);
        if (
            error.response.data.msg &&
            error.response.data.msg === "Token expired!"
        ) {
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

export const unscheduleLeave = (leaveId, scheduledDate) => async dispatch => {
    if (leaveId === "" || typeof leaveId === "undefined") return;
    try {
        const leaveData = {
            scheduled: false,
            scheduledDate: null
        };
        const res = await axios.put(`/api/leaves/${leaveId}`, leaveData);
        console.log(scheduledDate);
        console.log(`Calling get monthly leaves with year ${scheduledDate.year()}
        month ${scheduledDate.month() + 1}
        `);
        dispatch(
            getMonthlyLeaves(scheduledDate.year(), scheduledDate.month() + 1)
        );
    } catch (error) {
        console.log(error);
        if (
            error.response.data.msg &&
            error.response.data.msg === "Token expired!"
        ) {
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

export const addOrEditLeave = (
    personnelId,
    leaveId,
    leaveData,
    edit,
    history
) => async dispatch => {

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    setAuthToken(localStorage.getItem("token"));

    try {
        let res;
        if (edit) {
            res = await axios.put(
                `/api/leaves/${leaveId}`,
                leaveData,
                config
            );
        } else {
            res = await axios.post("/api/leaves", leaveData, config);
        }
        dispatch({
            type: ADD_OR_EDIT_LEAVE,
            payload: res
        });
        dispatch(getPersonnelLeaves(personnelId)); // refresh all personnel in Redux store
        history.push(`/edit-personnel-leaves/${personnelId}`);
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
        if (error.response.data.hasOwnProperty("msg")) {
            if (error.response.data.msg === "Token expired!") {
                dispatch({
                    type: LOGOUT
                });
            }
        }
    }
};
