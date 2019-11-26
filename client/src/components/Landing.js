import React, { Fragment } from "react";
import { Redirect } from 'react-router-dom'
import PropTypes from "prop-types";
import { Container, Row, Col } from "reactstrap";
import LoginModal from './auth/LoginModal';
import { connect } from 'react-redux';

const Landing = props => {
    const { isAuthenticated } = props;

    if (isAuthenticated) {
        return <Redirect to="/summary"/>
    }
    return (
        <Fragment>
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
    );
};

Landing.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Landing);
