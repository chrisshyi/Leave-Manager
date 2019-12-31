import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter
} from "reactstrap";
import { connect } from "react-redux";
import { toggleModal, setLeaveToEdit } from "../../actions/modals";
import {
    unscheduleLeave,
    scheduleLeave,
    getMonthlyLeaves
} from "../../actions/leaves";
import moment from "moment";
import uuidv4 from "uuid";

const EditLeaveModal = props => {
    const {
        toggleModal,
        showModal,
        leaveToEdit,
        leaveToEditId,
        editLeaveDate,
        addLeave,
        availableLeaves,
        getMonthlyLeaves,
        setLeaveToEdit,
        scheduleLeave,
        unscheduleLeave
    } = props;
    const toggle = () => toggleModal(!showModal, null, null);

    let modalBody;
    if (!addLeave) {
        modalBody = (
            <ModalBody>
                <p>
                    Are you sure you want to unschedule the leave on{" "}
                    {leaveToEdit &&
                        moment(leaveToEdit.scheduledDate).format("MM/DD")}
                    ?
                </p>
            </ModalBody>
        );
    } else {
        const getLeaveStr = (leave, date) => {
            const leaveOriginalDate = moment(leave.originalDate);
            const leaveScheduledDate = moment(leave.scheduledDate);
            if (leave.leaveType === "例假") {
                if (leaveScheduledDate.isBefore(leaveOriginalDate)) {
                    return `預${leaveOriginalDate.format("YY/MM/DD")}`;
                } else if (leaveScheduledDate.isAfter(leaveOriginalDate)) {
                    return `補${leaveOriginalDate.format("YY/MM/DD")}`;
                } else {
                    return "例假";
                }
            }
            return `${leave.leaveType} ${leaveOriginalDate.format("YY/MM/DD")}`;
        };

        modalBody = (
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="available-leave-select">
                            Available Leaves
                        </Label>
                        <Input
                            onChange={e => {
                                e.preventDefault();
                                setLeaveToEdit(e.target.value);
                            }}
                            value={leaveToEditId}
                            type="select"
                            name="availableLeave"
                            id="available-leave-select"
                        >
                            <option disabled selected value> -- select a leave -- </option>
                            {availableLeaves &&
                                availableLeaves.leaves.map(leave => {
                                    return (
                                        <option
                                            key={uuidv4()}
                                            value={leave._id}
                                        >
                                            {getLeaveStr(leave, editLeaveDate)}
                                        </option>
                                    );
                                })}
                        </Input>
                    </FormGroup>
                </Form>
            </ModalBody>
        );
    }

    return (
        <Fragment>
            <Modal isOpen={showModal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{addLeave ? "Add Leave" : "Remove Leave"}</ModalHeader>
                {modalBody}
                <ModalFooter>
                    {addLeave ? (
                        <Fragment>
                            <Button
                                color="success"
                                onClick={e => {
                                    scheduleLeave(leaveToEditId, editLeaveDate);
                                    toggle();
                                }}
                            >
                                Schedule
                            </Button>
                            <Button color="secondary" onClick={toggle}>
                                Cancel
                            </Button>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Button
                                color="danger"
                                onClick={e => {
                                    unscheduleLeave(
                                        leaveToEdit._id,
                                        editLeaveDate
                                    );
                                    toggle();
                                }}
                            >
                                Unschedule
                            </Button>{" "}
                            <Button color="secondary" onClick={toggle}>
                                Cancel
                            </Button>
                        </Fragment>
                    )}
                </ModalFooter>
            </Modal>
        </Fragment>
    );
};

EditLeaveModal.propTypes = {
    editLeaveDate: PropTypes.object,
    addLeave: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    setLeaveToEdit: PropTypes.func.isRequired,
    leaveToEditId: PropTypes.string.isRequired,
    leaveToEdit: PropTypes.object.isRequired,
    showModal: PropTypes.bool.isRequired,
    availableLeaves: PropTypes.array,
    scheduleLeave: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    const {
        showModal,
        editLeaveDate,
        leaveToEdit,
        addLeave,
        leaveToEditId
    } = state.modals;
    const { availableLeaves } = state.leaves;
    return {
        showModal,
        editLeaveDate,
        leaveToEdit,
        leaveToEditId,
        addLeave,
        availableLeaves
    };
};

export default connect(mapStateToProps, {
    toggleModal,
    getMonthlyLeaves,
    setLeaveToEdit,
    scheduleLeave,
    unscheduleLeave
})(EditLeaveModal);
