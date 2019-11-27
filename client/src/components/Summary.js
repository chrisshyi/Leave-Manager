import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "./layouts/Spinner";
import { Redirect } from "react-router-dom";
import { Container, Row, Col, Table } from "reactstrap";
import { getTodayLeaves } from '../actions/leaves';

const Summary = props => {
    const { auth: { personnel, isAuthenticated }, getTodayLeaves } = props;
    const { leaves } = props.leaves;
    useEffect(() => {
        getTodayLeaves();
    }, [])
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
                <Col sm="5">
                    <h3>Welcome {personnel.name}</h3>
                    <p>{(new Date()).toDateString()}</p>
                </Col>
                <Col sm="3"></Col>
            </Row>
        </Container>
    );
};

Summary.propTypes = {
    auth: PropTypes.object.isRequired,
    getTodayLeaves: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    leaves: state.leaves
});

export default connect(mapStateToProps, { getTodayLeaves })(Summary);
