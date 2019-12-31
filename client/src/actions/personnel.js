import {
    GET_PERSONNEL_LEAVES,
    LOGOUT,
    GET_ALL_PERSONNEL,
    ADD_OR_EDIT_PERSONNEL
} from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

export const getAllPersonnel = () => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    setAuthToken(localStorage.getItem("token"));
    try {
        const res = await axios.get("/api/personnel", config);
        dispatch({
            type: GET_ALL_PERSONNEL,
            payload: res.data.personnel
        });
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
        if (error.response.data.msg.hasOwnProperty("msg") &&
            error.response.data.msg === "Token expired!") {
            dispatch({
                type: LOGOUT
            });
        }
    }
};

export const addOrEditPersonnel = (
    personnelId,
    personnelData,
    edit,
    history // used to navigate back to /admin after successful addition/edit
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
                `/api/personnel/${personnelId}`,
                personnelData,
                config
            );
        } else {
            res = await axios.post("/api/personnel", personnelData, config);
        }
        dispatch({
            type: ADD_OR_EDIT_PERSONNEL,
            payload: res
        });
        dispatch(getAllPersonnel()); // refresh all personnel in Redux store
        history.push("/admin");
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
        if (error.response.data.hasOwnProperty("msg") &&
            error.response.data.msg === "Token expired!") {
                dispatch({
                    type: LOGOUT
                });
            }
        }
    }

export const getPersonnelLeaves = personnelId => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    setAuthToken(localStorage.getItem("token"));
    try {
        const res = await axios.get(`/api/personnel/${personnelId}`, config);
        dispatch({
            type: GET_PERSONNEL_LEAVES,
            payload: res.data["personnel"]
        });
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

export const deletePersonnel = personnelId => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    setAuthToken(localStorage.getItem("token"));
    try {
        await axios.delete(`/api/personnel/${personnelId}`, config);
        dispatch(getAllPersonnel());
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