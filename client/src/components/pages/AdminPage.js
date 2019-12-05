import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import {
    Container,
    Table,
    Row,
    Col,
    Button,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Card,
    CardTitle,
    CardText
} from "reactstrap";
import { getAllPersonnel } from "../../actions/personnel";
import { Link } from "react-router-dom";
import "../../styles/admin-page.css";

const AdminPage = props => {
    const [activeTab, setActiveTab] = useState("1");

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    const { personnel, getAllPersonnel } = props;

    useEffect(() => {
        getAllPersonnel();
    }, []);

    return (
        <Container className="mt-5">
            <Row>
                <Col sm="2"></Col>
                <Col sm="8">
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({
                                    active: activeTab === "1"
                                })}
                                onClick={() => {
                                    toggle("1");
                                }}
                            >
                                Manage Personnel
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({
                                    active: activeTab === "2"
                                })}
                                onClick={() => {
                                    toggle("2");
                                }}
                            >
                                Manage Leaves
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Col>
                <Col sm="2"></Col>
            </Row>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
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
                                            edit: false
                                        }
                                    }}
                                >
                                    <Button outline color="primary">
                                        Add Personnel{" "}
                                        <i class="fas fa-plus-circle"></i>
                                    </Button>
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
                                            <tr>
                                                <td>{person.org.name}</td>
                                                <td>{person.name}</td>
                                                <td>
                                                    <Link
                                                        to={{
                                                            pathname: `/edit-personnel/${person._id}`,
                                                            state: {
                                                                nameToEdit:
                                                                    person.name,
                                                                titleToEdit:
                                                                    person.title,
                                                                roleToEdit:
                                                                    person.role,
                                                                edit: true
                                                            }
                                                        }}
                                                    >
                                                        <Button
                                                            outline
                                                            color="success"
                                                        >
                                                            Edit Personnel{" "}
                                                            <i class="far fa-edit"></i>
                                                        </Button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/edit-personnel-leaves/${person._id}`}
                                                    >
                                                        <Button
                                                            outline
                                                            color="info"
                                                        >
                                                            Edit Leaves{" "}
                                                            <i class="far fa-edit"></i>
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
                </TabPane>
                <TabPane tabId="2">
                    <Row>
                        <Col sm="6">
                            <Card body>
                                <CardTitle>Special Title Treatment</CardTitle>
                                <CardText>
                                    With supporting text below as a natural
                                    lead-in to additional content.
                                </CardText>
                                <Button>Go somewhere</Button>
                            </Card>
                        </Col>
                        <Col sm="6">
                            <Card body>
                                <CardTitle>Special Title Treatment</CardTitle>
                                <CardText>
                                    With supporting text below as a natural
                                    lead-in to additional content.
                                </CardText>
                                <Button>Go somewhere</Button>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </Container>
    );
};

AdminPage.propTypes = {
    personnel: PropTypes.array.isRequired,
    getAllPersonnel: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        personnel: state.personnel.personnel
    };
};

export default connect(mapStateToProps, { getAllPersonnel })(AdminPage);
