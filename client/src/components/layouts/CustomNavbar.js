import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from "reactstrap";

const CustomNavbar = props => {
    const { isAuthenticated, logout } = props;
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    return (
        <div>
            <Navbar color="dark" dark expand="md">
                <NavbarBrand href="/">reactstrap</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        {isAuthenticated ? (
                            <Fragment>
                                <NavItem onClick={() => logout()}>
                                    <NavLink href="#">Logout</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="/admin">Admin</NavLink>
                                </NavItem>
                            </Fragment>
                        ) : (
                            ""
                        )}
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
};

CustomNavbar.propTypes = {
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(CustomNavbar);
