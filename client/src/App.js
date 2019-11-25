import React, { useState, Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import LoginModal from "./auth/LoginModal";
import { Provider } from "react-redux";
import store from "./store";
import CustomNavbar from "./components/layouts/CustomNavbar";

const App = props => {
    return (
        <Provider store={store}>
            <Fragment>
                <CustomNavbar />
                <Container className="mt-5">
                    <Row className="align-items-center">
                        <Col sm="4"></Col>
                        <Col sm="4" xs="12">
                            <LoginModal buttonLabel={"Login"} />
                        </Col>
                        <Col sm="4"></Col>
                    </Row>
                </Container>
            </Fragment>
        </Provider>
    );
};

export default App;
