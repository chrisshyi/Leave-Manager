import PropTypes from "prop-types";
import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { Table, Row, Col, Button } from "reactstrap";
import { getAllPersonnel, deletePersonnel } from "../../../actions/personnel";
import { Link, Redirect } from "react-router-dom";
import "../../../styles/admin-page.css";
import uuidv4 from "uuid";

const PersonnelAdmin = props => {
    const { personnel, getAllPersonnel, deletePersonnel, auth: { isAuthenticated } } = props;

    useEffect(() => {
        getAllPersonnel();
    }, []);
    if (!isAuthenticated) {
        return <Redirect to="/" />;
    }

    return (
        <Fragment>
            <Row className="mt-5">
                <Col sm="1"></Col>
                <Col sm="10">
                    {props.auth.personnel && props.auth.personnel.role === "reg-user" ? (
                        " "
                    ) : (
                        <Link
                            to={{
                                pathname: "/add-personnel",
                                state: {
                                    nameToEdit: "",
                                    titleToEdit: "",
                                    roleToEdit: "",
                                    edit: false,
                                    org: props.auth.personnel.org
                                }
                            }}
                        >
                            <Button outline color="primary">
                                Add Personnel{" "}
                                <i className="fas fa-plus-circle"></i>
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
                                <th width="20%">Org</th>
                                <th width="20%">Name</th>
                                <th width="20%"></th>
                                <th width="20%"></th>
                                <th width="20%"></th>
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
                                                    emailToEdit: person.email,
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
                                    <td>
                                        <Button
                                            outline
                                            color="danger"
                                            onClick={e => {
                                                deletePersonnel(person._id);
                                            }}
                                        >
                                            Delete Personnel{" "}
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
        </Fragment>
    );
};

PersonnelAdmin.propTypes = {
    personnel: PropTypes.array.isRequired,
    getAllPersonnel: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        auth: state.auth,
        personnel: state.personnel.allPersonnel
    };
};

export default connect(mapStateToProps, { getAllPersonnel, deletePersonnel })(
    PersonnelAdmin
);
