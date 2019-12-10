import { connect } from "react-redux";
import { getPersonnelLeaves } from "../../../actions/personnel";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useEffect, Fragment } from "react";
import { Table, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import uuidv4 from "uuid";

const PersonnelLeaveAdmin = props => {
    const { getPersonnelLeaves } = props;
    const { personnelId } = useParams();
    useEffect(() => {
        getPersonnelLeaves(personnelId);
    }, []);
    const { personnel, leaves } = props.personnelLeaves;

    return personnel === null ? (
        <Fragment>
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
                                    org: personnel.org,
                                    personnel: personnel._id
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
                                <th width="25%">Org</th>
                                <th width="25%">Name</th>
                                <th width="25%"></th>
                                <th width="25%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {personnel.map(person => (
                                <tr key={uuidv4()}>
                                    <td>{person.org.name}</td>
                                    <td>{person.name}</td>
                                    <td>
                                        <Link
                                            to={{
                                                pathname: `/edit-personnel/${person._id}`,
                                                state: {
                                                    nameToEdit: person.name,
                                                    titleToEdit: person.title,
                                                    roleToEdit: person.role,
                                                    edit: true,
                                                    org:
                                                        props.auth.personnel.org
                                                }
                                            }}
                                        >
                                            <Button outline color="success">
                                                Edit Personnel{" "}
                                                <i className="far fa-edit"></i>
                                            </Button>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link
                                            to={{
                                                pathname: `/edit-personnel-leaves/${person._id}`,
                                                state: {
                                                    personnel: person
                                                }
                                            }}
                                        >
                                            <Button outline color="info">
                                                Edit Leaves{" "}
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
        </Fragment>
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
