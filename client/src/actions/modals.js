import { SET_LEAVE_TO_EDIT, SHOW_MODAL, HIDE_MODAL } from './types';

export const toggleModal = (showModal, leaveToEdit, editLeaveDate, addLeave) => async dispatch => {
    // showModal is the current state of the modal
    if (!showModal) {
        dispatch({
            type: HIDE_MODAL
        });
    } else {
        dispatch({
            type: SHOW_MODAL,
            payload: {
                editLeaveDate,
                addLeave,
                leaveToEdit
            }
        });
    }
}
export const setLeaveToEdit = leaveId => async dispatch => {
    dispatch({
        type:  SET_LEAVE_TO_EDIT,
        payload: leaveId
    });
}