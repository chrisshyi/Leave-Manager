import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "./layouts/Spinner";
import { Redirect } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

const Summary = props => {
    const { personnel, isAuthenticated } = props.auth;
    if (!isAuthenticated) {
        return <Redirect to="/" />;
    }
    if (!personnel) {
        return <Spinner />;
    }
    return (
        <Container>
            <Row className="mt-5">
                <Col sm="4"></Col>
                <Col sm="4">
                    <h1>Welcome {personnel.name}</h1>
                </Col>
                <Col sm="4"></Col>
            </Row>
        </Container>
    );
};

Summary.propTypes = {
    personnel: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(Summary);
