import { SHOW_MODAL, HIDE_MODAL } from "../actions/types";

const initialState = {
    showModal: false,
    editLeaveDate: null,
    leaveToEdit: null,
    addLeave: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SHOW_MODAL:
            console.log(
                `Set edit leave date to ${action.payload.editLeaveDate.format("MM/DD")}`
            );
            return {
                showModal: true,
                editLeaveDate: action.payload.editLeaveDate,
                addLeave: action.payload.addLeave,
                leaveToEdit: action.payload.leaveToEdit
            };
        case HIDE_MODAL:
            return initialState;
        default:
            return state;
    }
}
