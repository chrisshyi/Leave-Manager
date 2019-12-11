import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { addOrEditLeave } from '../../../actions/leaves';
import { connect } from 'react-redux';
import {
    Row, Col, Form, Input, FormGroup, Label, Button, Container
} from 'reactstrap'

const LeaveForm = props => {
    const leaveTypes = ["慰假", "預假", "補假", "例假", "公假", "外散", "外宿"];
    const {
        leaveTypeToEdit,
        scheduledDateToEdit,
        originalDateToEdit,
        durationToEdit,
        org,
        personnelId,
        edit
    } = props.location.state;
    let { leaveId } = useParams();

    const [formData, setFormData] = useState(
        edit
            ? {
                  leaveType: leaveTypeToEdit,
                  scheduledDate: scheduledDateToEdit,
                  originalDate: originalDateToEdit,
                  duration: durationToEdit,
                  personnel: personnelId,
                  org
              }
            : {
                  leaveType: "",
                  scheduledDate: "",
                  originalDate: "",
                  duration: '',
                  personnel: personnelId,
                  org
              }
    );

    const { addOrEditLeave } = props;
    const { leaveType, scheduledDate, originalDate, duration } = formData;
    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    return (
        <Container>
            <Row className="mt-5">
                <Col sm="4" />
                <Col sm="4">
                    <h3>{edit ? "Edit" : "Add"} Leave</h3>
                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                            addOrEditLeave(personnelId, leaveId, formData, edit, props.history);
                        }}
                    >
                        <FormGroup>
                            <Label for="leave-type">Leave Type</Label>
                            <Input
                                type="select"
                                value={leaveType}
                                onChange={e => onChange(e)}
                                name="leaveType"
                                id="leave-type"
                            >
                                <option disabled defaultValue value=''> -- select leave type -- </option>
                                {leaveTypes.map(leaveType => (
                                    <option value={leaveType}>{leaveType}</option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="original-date">Original Date</Label>
                            <Input
                                type="date"
                                name="originalDate"
                                value={originalDate}
                                onChange={e => onChange(e)}
                                id="original-date"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="scheduled-date">Scheduled Date</Label>
                            <Input
                                type="date"
                                name="scheduledDate"
                                value={scheduledDate}
                                onChange={e => onChange(e)}
                                id="scheduled-date"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="duration">Duration</Label>
                            <Input
                                value={duration}
                                onChange={e => onChange(e)}
                                type="number"
                                name="duration"
                                id="duration"
                                min="4.5"
                                max="24"
                                step="0.5"
                                placeholder="24"
                            />
                        </FormGroup>
                        <Button color="success">Submit</Button>
                        {"    "}
                        <Link to={`/edit-personnel-leaves/${personnelId}`}>
                            <Button color="danger">Back</Button>
                        </Link>
                    </Form>
                </Col>
                <Col sm="4" />
            </Row>
        </Container>
    );
};

LeaveForm.propTypes = {
    addOrEditLeave: PropTypes.func.isRequired,
};

export default connect(null, { addOrEditLeave })(LeaveForm);
