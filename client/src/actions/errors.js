import { SET_ERR_MSG, CLEAR_ERR_MSG } from "./types";

const ERR_MSG_DURATION = 3000;
export const setErrMsg = errMsg => dispatch => {
    dispatch({
        type: SET_ERR_MSG,
        payload: errMsg
    });
    setTimeout(() => {
        dispatch({
            type: CLEAR_ERR_MSG
        });
    }, ERR_MSG_DURATION);
};