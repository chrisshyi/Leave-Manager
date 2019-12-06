import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import {
    Container,
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
import "../../styles/admin-page.css";
import PersonnelAdmin from "./admin/PersonnelAdmin";

const AdminPage = props => {
    const [activeTab, setActiveTab] = useState("1");

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };

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
                    <PersonnelAdmin />
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

AdminPage.propTypes = {};

export default AdminPage;
