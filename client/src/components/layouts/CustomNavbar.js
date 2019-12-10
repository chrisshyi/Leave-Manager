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
import { Link } from "react-router-dom";
import "../../styles/navbar.css";

const CustomNavbar = props => {
    const { isAuthenticated, logout } = props;
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    const today = new Date();
    return (
        <div>
            <Navbar color="dark" dark expand="md">
                <NavbarBrand href="#">
                    <Link to="/" className="navbar-link">
                        reactstrap
                    </Link>
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        {isAuthenticated ? (
                            <Fragment>
                                <NavItem onClick={() => logout()}>
                                    <NavLink href="#">Logout</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="#">
                                        <Link
                                            to="/admin"
                                            className="navbar-link"
                                        >
                                            Admin
                                        </Link>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="#">
                                        <Link
                                            className="navbar-link"
                                            to={`/monthly-view?year=${today.getFullYear()}&month=${today.getMonth() +
                                                1}`}
                                        >
                                            View Month
                                        </Link>
                                    </NavLink>
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
