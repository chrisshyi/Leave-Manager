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
import { toggleModal } from "../../actions/modals";
import moment from 'moment';

const EditLeaveModal = props => {
    const {
        toggleModal,
        showModal,
        leaveToEdit,
        editLeaveDate,
        addLeave,
        availableLeaves
    } = props;
    const toggle = () => toggleModal(!showModal, null, null);
    const [leaveToSchedule, setLeaveToSchedule] = useState({});

    let modalBody;
    if (!addLeave) {
        modalBody = (
            <ModalBody>
                <p>
                    Are you sure you want to unschedule the leave on{" "}
                    {leaveToEdit && moment(leaveToEdit.scheduledDate).format("MM/DD")}?
                </p>
            </ModalBody>
        );
    } else {
        const getLeaveStr = (leave, date) => {
            const leaveOriginalDate = moment(leave.originalDate);
            if (date.isBefore(leaveOriginalDate)) {
                return `預${leaveOriginalDate.format("MM/DD")}`;
            } else if (date.isAfter(leaveOriginalDate)) {
                return `補${leaveOriginalDate.format("MM/DD")}`;
            } else {
                return "例假";
            }
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
                                setLeaveToSchedule(e.target.value);
                            }}
                            value={leaveToSchedule}
                            type="select"
                            name="availableLeave"
                            id="available-leave-select"
                        >
                            {availableLeaves && availableLeaves.leaves.map(leave => {
                                return <option value={leave._id}>
                                    {getLeaveStr(leave, editLeaveDate)}
                                </option>
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
                <ModalHeader toggle={toggle}>Add/Edit Leave</ModalHeader>
                {modalBody}
                <ModalFooter>
                    {addLeave ? (
                        <Fragment>
                            <Button color="success" onClick={toggle}>
                                Schedule
                            </Button>
                            <Button color="secondary" onClick={toggle}>
                                Cancel
                            </Button>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Button color="danger" onClick={toggle}>
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
    addLeave: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
    const { showModal, editLeaveDate, leaveToEdit, addLeave } = state.modals;
    const { availableLeaves } = state.leaves;
    return {
        showModal,
        editLeaveDate,
        leaveToEdit,
        addLeave,
        availableLeaves
    };
};

export default connect(mapStateToProps, { toggleModal })(EditLeaveModal);
