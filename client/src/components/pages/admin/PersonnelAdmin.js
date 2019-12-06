import PropTypes from "prop-types";
import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import {
    Table,
    Row,
    Col,
    Button,
} from "reactstrap";
import { getAllPersonnel } from "../../../actions/personnel";
import { Link } from "react-router-dom";
import "../../../styles/admin-page.css";
import uuidv4 from 'uuid';

const PersonnelAdmin = props => {
    const { personnel, getAllPersonnel } = props;

    useEffect(() => {
        getAllPersonnel();
    }, []);
    return (
        <Fragment>
            <Row className="mt-3">
                <Col sm="2"></Col>
                <Col sm="8">
                    <Link
                        to={{
                            pathname: `/add-personnel`,
                            state: {
                                nameToEdit: "",
                                titleToEdit: "",
                                roleToEdit: "",
                                edit: false,
                                org: props.auth.personnel.org
                            }
                        }}
                    >
                        {props.auth.personnel.role === "reg-user" ? (
                            " "
                        ) : (
                            <Button outline color="primary">
                                Add Personnel <i className="fas fa-plus-circle"></i>
                            </Button>
                        )}
                    </Link>
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
                                                    org: props.auth.personnel.org
                                                }
                                            }}
                                        >
                                            <Button outline color="success">
                                                Edit Personnel{" "}
                                                <i class="far fa-edit"></i>
                                            </Button>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link
                                            to={`/edit-personnel-leaves/${person._id}`}
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
    );
};

PersonnelAdmin.propTypes = {
    personnel: PropTypes.array.isRequired,
    getAllPersonnel: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        auth: state.auth,
        personnel: state.personnel.personnel
    };
};

export default connect(mapStateToProps, { getAllPersonnel })(PersonnelAdmin);
