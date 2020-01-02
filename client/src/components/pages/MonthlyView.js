import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { getAllPersonnel } from "../../actions/personnel";
import { connect } from "react-redux";
import { Container, Table, Row, Col } from "reactstrap";
import { getMonthlyLeaves } from "../../actions/leaves";
import MonthlyViewTableCell from "./MonthlyViewTableCell";
import queryString from "query-string";
import "../../styles/monthly-view.css";
import { Button } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import EditLeaveModal from "./EditLeaveModal";
import uuidv4 from "uuid";

const hashLeaves = leavesArr => {
    let leavesMap = new Map();

    for (let leave of leavesArr) {
        let leaveDate = Moment(leave.scheduledDate);
        if (!leavesMap.has(leave.personnel._id)) {
            leavesMap.set(leave.personnel._id, new Map());
        }
        leavesMap
            .get(leave.personnel._id)
            .set(leaveDate.format("MM/DD"), leave);
    }
    return leavesMap;
};

const getDayOfWeekString = index => {
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs"
    , "Fri", "Sat"];

    return daysOfWeek[index];
}

const MonthlyView = props => {
    let { year, month } = queryString.parse(props.location.search);
    year = Number.parseInt(year);
    month = Number.parseInt(month);
    useEffect(() => {
        props.getAllPersonnel();
    }, [year, month]);
    useEffect(() => {
        props.getMonthlyLeaves(year, month);
    }, [year, month]);
    const { allPersonnel } = props.personnel;
    if (!props.isAuthenticated) {
        return <Redirect to="/" />;
    }
    const moment = extendMoment(Moment);

    const tableCellHeight = '48px';

    // cannot reuse Moment objects as setting the year and month mutate the
    // original object, instead of creating a new one
    const startOfMonth = moment()
        .year(year)
        .month(month - 1)
        .startOf("month");
    const endOfMonth = moment()
        .year(year)
        .month(month)
        .startOf("month")
        .subtract(1, "days");
    const monthRange = moment.range(startOfMonth, endOfMonth);

    const daysArray = Array.from(monthRange.by("day"));
    const monthlyLeaves = props.monthlyLeaves.leaves;
    let leavesMap;
    if (monthlyLeaves && monthlyLeaves.length > 0) {
        leavesMap = hashLeaves(monthlyLeaves);
    }

    const prevMonthURL =
        month === 1
            ? `/monthly-view?year=${year - 1}&month=12`
            : `/monthly-view?year=${year}&month=${month - 1}`;
    const nextMonthURL =
        month === 12
            ? `/monthly-view?year=${year + 1}&month=1`
            : `/monthly-view?year=${year}&month=${month + 1}`;

    const dateTable = (
        <Table id="date-table">
            <thead>
                <tr height={tableCellHeight}>
                    <th colSpan="2" className="monthly-table-header border border-secondary head-col date-table-cell">
                        Dates
                    </th>
                </tr>
            </thead>
            <tbody>
                {daysArray.map(day => (
                    <tr height={tableCellHeight}>
                        <td key={uuidv4()} className="head-col date-table-cell">{day.format("MM/DD")}</td>
                        <td key={uuidv4()} className="head-col date-table-cell">{getDayOfWeekString(day.day())}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
    const leaveTable = (
        <Table id="leave-table">
            <thead>
                <tr height={tableCellHeight}> 
                    {allPersonnel.map(person => (
                        <th className="monthly-table-header border border-secondary leave-table-cell">
                            {person.name}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {daysArray.map(day => (
                    <tr height={tableCellHeight}>
                        {// Due to the nature of useEffect(), allPersonnel and monthlyLeaves
                        // may be undefined when the component is first rendered
                        // Thus a null/undefined check must be included
                        allPersonnel &&
                            allPersonnel.length > 0 &&
                            allPersonnel.map(person => {
                                if (monthlyLeaves && monthlyLeaves.length > 0) {
                                    const dateStr = day.format("MM/DD");
                                    if (leavesMap.has(person._id)) {
                                        const dateLeaveMap = leavesMap.get(
                                            person._id
                                        );
                                        if (dateLeaveMap.has(dateStr)) {
                                            const leaveOnDate = dateLeaveMap.get(
                                                dateStr
                                            );
                                            return (
                                                <MonthlyViewTableCell
                                                    key={uuidv4()}
                                                    leave={leaveOnDate}
                                                    date={day}
                                                    personnel={person}
                                                />
                                            );
                                        }
                                    }
                                }
                                return (
                                    <MonthlyViewTableCell
                                        key={uuidv4()}
                                        leave={null}
                                        date={day}
                                        personnel={person}
                                    />
                                );
                            })}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
    return (
        <Container>
            <Row className="mt-5">
                <Col sm="4"></Col>
                <Col sm="4" style={{ "text-align": "center" }}>
                    <h1>{`${year}-${month}`}</h1>
                </Col>
                <Col sm="4"></Col>
            </Row>
            <Row>
                <Col sm="4"></Col>
                <Col sm="4">
                    <EditLeaveModal />
                </Col>
                <Col sm="4"></Col>
            </Row>
            <Row className="mb-4">
                <Col
                    sm="2"
                    style={{ display: "flex", "justify-content": "center" }}
                >
                    <Link to={prevMonthURL}>
                        <Button color="primary">
                            <i className="fas fa-arrow-circle-left"></i> Prev
                        </Button>
                    </Link>
                </Col>
                <Col sm="2"></Col>
                <Col sm="2"></Col>
                <Col sm="2"></Col>
                <Col sm="2"></Col>
                <Col
                    sm="2"
                    style={{ display: "flex", "justify-content": "center" }}
                >
                    <Link to={nextMonthURL}>
                        <Button color="primary">
                            Next <i className="fas fa-arrow-circle-right"></i>
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col md="1"></Col>
                <Col md="2">{dateTable}</Col>
                <Col md="8" sm="8" xs="8" id="leave-table-container">{leaveTable}</Col>
                <Col md="1"></Col>
            </Row>
        </Container>
    );
};

MonthlyView.propTypes = {
    personnel: PropTypes.object.isRequired,
    monthlyLeaves: PropTypes.object,
    getAllPersonnel: PropTypes.func.isRequired,
    getMonthlyLeaves: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    personnel: state.personnel,
    monthlyLeaves: state.leaves.monthlyLeaves,
    authPersonnel: state.auth.personnel,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getAllPersonnel, getMonthlyLeaves })(
    MonthlyView
);
