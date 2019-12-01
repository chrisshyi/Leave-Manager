import { ADD_OR_DELETE_LEAVE } from "./types";

export default (editLeaveDate, addLeave) => async dispatch => {
    dispatch({
        type: ADD_OR_DELETE_LEAVE,
        payload: {
            editLeaveDate,
            addLeave
        }
    });
};
