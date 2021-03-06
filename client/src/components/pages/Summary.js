import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import { Redirect, Link } from "react-router-dom";
import { Container, Row, Col, Table } from "reactstrap";
import { getTodayLeaves } from "../../actions/leaves";
import setAuthToken from "../../utils/setAuthToken";

/** @function
 *  Renders a summary of the people on leave within 
 *  the organization on the current day 
 */
const Summary = props => {
    useEffect(() => {
        setAuthToken(localStorage.getItem("token"));
        props.getTodayLeaves();
    }, []); // for the initial render

    useEffect(() => {
        const interval = setInterval(() => {
            props.getTodayLeaves();
        }, 60000); // poll the server every minute to get the latest leaves
        return () => clearInterval(interval);
    });

    const {
        auth: { personnel, isAuthenticated }
    } = props;
    if (!isAuthenticated) {
        return <Redirect to="/" />;
    }
    if (!personnel) {
        return <Spinner />;
    }
    const todayLeaves = props.todayLeaves.leaves;
    const today = new Date();
    return (
        <Container>
            <Row className="mt-5">
                <Col sm="4"></Col>
                <Col sm="4">
                    <h3>Welcome {personnel.name}</h3>
                    <p>{new Date().toDateString()}</p>
                </Col>
                <Col sm="4"></Col>
            </Row>
            <Row>
                <Col sm="4"></Col>
                <Col sm="4">
                    {todayLeaves && (
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>On Leave</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todayLeaves.map((leave, index) => (
                                    <tr key={index}>
                                        <td>{leave.personnel.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
                <Col sm="4"></Col>
            </Row>
            <Row>
                <Col sm="4"></Col>
                <Col sm="4">
                    <Link
                        to={`/monthly-view?year=${
                            today.getFullYear()
                        }&month=${today.getMonth() + 1}`}
                    >
                        View Month
                    </Link>
                </Col>
                <Col sm="4"></Col>
            </Row>
        </Container>
    );
};

Summary.propTypes = {
    auth: PropTypes.object.isRequired,
    getTodayLeaves: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    todayLeaves: state.leaves.todayLeaves
});

export default connect(mapStateToProps, { getTodayLeaves })(Summary);
export { Summary };
