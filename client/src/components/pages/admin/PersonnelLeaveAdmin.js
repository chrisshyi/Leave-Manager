import { connect } from "react-redux";
import { getPersonnelLeaves } from "../../../actions/personnel";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useEffect, Fragment } from "react";
import { Table, Row, Col, Button, Container } from "reactstrap";
import { Link } from "react-router-dom";
import uuidv4 from "uuid";
import moment from "moment";

const PersonnelLeaveAdmin = props => {
    const { getPersonnelLeaves } = props;
    const { personnelId } = useParams();
    useEffect(() => {
        getPersonnelLeaves(personnelId);
    }, []);
    const { name, org, leaves } = props.personnelLeaves;

    return typeof leaves !== "undefined" ? (
        <Container>
            <Row className="mt-3">
                <Col sm="2"></Col>
                <Col sm="8">
                    {props.auth.personnel.role === "reg-user" ? (
                        " "
                    ) : (
                        <Link
                            to={{
                                pathname: `/add-leave`,
                                state: {
                                    leaveTypeToEdit: "",
                                    scheduledToEdit: "",
                                    originalDateToEdit: "",
                                    scheduledDateToEdit: "",
                                    durationToEdit: 0,
                                    edit: false,
                                    org
                                }
                            }}
                        >
                            <Button outline color="primary">
                                Add Leave <i className="fas fa-plus-circle"></i>
                            </Button>
                        </Link>
                    )}
                </Col>
                <Col sm="2"></Col>
            </Row>
            <Row className="mt-2 mb-4">
                <Col sm="2"></Col>
                <Col sm="8">
                    <Table className="personnel-table">
                        <thead>
                            <tr>
                                <th width="20%">Leave Type</th>
                                <th width="20%">Original Date</th>
                                <th width="20%">Scheduled Date</th>
                                <th width="20%">Duration(hr)</th>
                                <th width="20%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map(leave => (
                                <tr key={uuidv4()}>
                                    <td>{leave.leaveType}</td>
                                    <td>
                                        {typeof leave.originalDate !==
                                        "undefined"
                                            ? moment(leave.originalDate).format(
                                                  "YYYY/MM/DD"
                                              )
                                            : ""}
                                    </td>
                                    <td>
                                        {typeof leave.scheduledDate !==
                                        "undefined"
                                            ? moment(leave.scheduledDate).format(
                                                  "YYYY/MM/DD"
                                              )
                                            : ""}
                                    </td>
                                    <td>{leave.duration}</td>
                                    <td>
                                        <Link
                                            to={{
                                                pathname: `/edit-leave/${leave.id}`,
                                                state: {
                                                    leaveTypeToEdit:
                                                        leave.leaveType,
                                                    scheduledToEdit:
                                                        leave.scheduled,
                                                    originalDateToEdit:
                                                        leave.originalDate,
                                                    scheduledDateToEdit:
                                                        leave.scheduledDate,
                                                    durationToEdit:
                                                        leave.duration,
                                                    edit: true
                                                }
                                            }}
                                        >
                                            <Button outline color="success">
                                                Edit Leave{" "}
                                                <i className="far fa-edit"></i>
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                <Col sm="2"></Col>
            </Row>
        </Container>
    ) : (
        ""
    );
};

PersonnelLeaveAdmin.propTypes = {};

const mapStateToProps = state => ({
    auth: state.auth,
    personnelLeaves: state.personnel.personnelLeaves
});

export default connect(mapStateToProps, { getPersonnelLeaves })(
    PersonnelLeaveAdmin
);
