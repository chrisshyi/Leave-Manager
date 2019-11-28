import { LOGOUT, GET_ALL_PERSONNEL } from "./types";
import axios from "axios";

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
        if (error.response.data.msg === "Token expired!") {
            dispatch({
                type: LOGOUT
            });
        }
    }
};
