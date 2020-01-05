import { connect } from "react-redux";
import { getPersonnelLeaves } from "../../../actions/personnel";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Table, Row, Col, Button, Container } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import uuidv4 from "uuid";
import moment from "moment";
import { deleteLeave } from '../../../actions/leaves';

const PersonnelLeaveAdmin = props => {
    const { getPersonnelLeaves, deleteLeave, auth: { isAuthenticated } } = props;
    const { personnelId } = useParams();
    useEffect(() => {
        getPersonnelLeaves(personnelId);
    }, []);
    const { name, org, leaves } = props.personnelLeaves;
    if (!isAuthenticated) {
        return <Redirect to="/" />;
    }


    return typeof leaves !== "undefined" ? (
        <Container>
            <Row className="mt-4">
                <Col sm="2"></Col>
                <Col sm="8" style={{ textAlign: "center" }}>
                    <h2>{name}</h2>
                </Col>
                <Col sm="2"></Col>
            </Row>
            <Row className="mt-1">
                <Col sm="1"></Col>
                <Col sm="10">
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
                                    personnelId,
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
                <Col sm="1"></Col>
            </Row>
            <Row className="mt-2 mb-4">
                <Col sm="1"></Col>
                <Col sm="10">
                    <Table className="personnel-table">
                        <thead>
                            <tr>
                                <th width="17%">Leave Type</th>
                                <th width="17%">Original Date</th>
                                <th width="17%">Scheduled Date</th>
                                <th width="15%">Duration(hr)</th>
                                <th width="17%"></th>
                                <th width="17%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map(leave => (
                                <tr key={uuidv4()}>
                                    <td>{leave.leaveType}</td>
                                    <td>
                                        {typeof leave.originalDate !==
                                            "undefined" && leave.originalDate
                                            ? moment(leave.originalDate).format(
                                                  "YYYY/MM/DD"
                                              )
                                            : ""}
                                    </td>
                                    <td>
                                        {typeof leave.scheduledDate !==
                                            "undefined" && leave.scheduledDate
                                            ? moment(
                                                  leave.scheduledDate
                                              ).format("YYYY/MM/DD")
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
                                                    personnelId,
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
                                    <td>
                                        <Button outline color="danger" onClick={e => {
                                            deleteLeave(leave.id, personnelId)
                                        }}>
                                            Delete Leave{" "}
                                            <i className="fas fa-times-circle"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                <Col sm="1"></Col>
            </Row>
        </Container>
    ) : (
        ""
    );
};

PersonnelLeaveAdmin.propTypes = {
    auth: PropTypes.object,
    personnelLeaves: PropTypes.object
};

const mapStateToProps = state => ({
    auth: state.auth,
    personnelLeaves: state.personnel.personnelLeaves
});

export default connect(mapStateToProps, { getPersonnelLeaves, deleteLeave })(
    PersonnelLeaveAdmin
);
