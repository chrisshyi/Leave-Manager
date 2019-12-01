import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
const EditLeaveModal = props => {
    const { toggleModal, showModal, editLeaveDate, addLeave } = props;
    const toggle = () => toggleModal(!showModal, null, null);
    const [formData, setFormData] = useState({
        leaveType: "",
        scheduled: false,
        originalDate: "",
        scheduledDate: "",
        duration: 0
    });

    const [originalDate, setOriginalDate] = useState(null);
    let modalBody;
    if (!addLeave) {
        modalBody = (
            <ModalBody>
                <p>
                    Are you sure you want to unschedule the leave on{" "}
                    {editLeaveDate && editLeaveDate.format("MM/DD")}?
                </p>
            </ModalBody>
        );
    } else {
        const { leaveType, originalDate, duration } = formData;
        const onChange = e => {
            e.preventDefault();
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };

        modalBody = (
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="leave-type-select">Select</Label>
                        <Input
                            onChange={e => onChange(e)}
                            value={leaveType}
                            type="select"
                            name="leaveType"
                            id="leave-type-select"
                        >
                            <option>慰假</option>
                            <option>榮譽假</option>
                            <option>例假</option>
                            <option>公假</option>
                            <option>外散</option>
                            <option>外宿</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <p>Original Date</p>
                        <DatePicker
                            id="original-date-picker"
                            selected={originalDate}
                            onChange={date => setOriginalDate(date)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="scheduled-date">Scheduled Date</Label>
                        <Input
                            disabled
                            id="scheduled-date"
                            type="text"
                            value={editLeaveDate.format("MM/DD")}
                        ></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="duration">Duration</Label>
                        <Input
                            type="number"
                            name="duration"
                            id="duration"
                            value={duration}
                            onChange={e => onChange(e)}
                        ></Input>
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
                            <Button color="success" onClick={toggle}>Schedule</Button>
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
    const { showModal, editLeaveDate, addLeave } = state.modals;
    return {
        showModal,
        editLeaveDate,
        addLeave
    };
};

export default connect(mapStateToProps, { toggleModal })(EditLeaveModal);
