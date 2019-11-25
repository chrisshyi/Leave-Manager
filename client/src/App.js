import React, { useState, Fragment } from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container,
    Row,
    Col
} from "reactstrap";
import LoginModal from "./auth/LoginModal";
import { Provider } from "react-redux";
import store from './store';

const App = props => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <Provider store={store}>
            <Fragment>
                <div>
                    <Navbar color="dark" dark expand="md">
                        <NavbarBrand href="/">reactstrap</NavbarBrand>
                        <NavbarToggler onClick={toggle} />
                        <Collapse isOpen={isOpen} navbar>
                            <Nav className="mr-auto" navbar>
                                <NavItem>
                                    <NavLink href="/components/">
                                        Components
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="https://github.com/reactstrap/reactstrap">
                                        GitHub
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                </div>
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
