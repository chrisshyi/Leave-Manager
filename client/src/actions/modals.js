import { SHOW_MODAL, HIDE_MODAL } from './types';

export const toggleModal = (showModal, editLeaveDate, addLeave) => async dispatch => {
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
                addLeave
            }
        });
    }
}