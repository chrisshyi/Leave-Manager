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
import { Link } from "react-router-dom";

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

const MonthlyView = props => {
    let { year, month } = queryString.parse(props.location.search);
    year = Number.parseInt(year);
    month = Number.parseInt(month);
    useEffect(() => {
        props.getAllPersonnel();
    }, [getAllPersonnel]);
    useEffect(() => {
        props.getMonthlyLeaves(year, month);
    }, [getMonthlyLeaves]);
    const { personnel } = props.personnel;
    const moment = extendMoment(Moment);

    // cannot reuse Moment objects as setting the year and month mutate the 
    // original object, instead of creating a new one
    const startOfMonth = moment().year(year).month(month - 1).startOf("month");
    const endOfMonth = moment().year(year).month(month - 1) 
        .startOf("month")
        .add(1, "months")
        .subtract(1, "days");
    console.log(`start of month ${startOfMonth}`);
    console.log(`end of month ${endOfMonth}`);
    const monthRange = moment.range(startOfMonth, endOfMonth);

    const daysArray = Array.from(monthRange.by("day"));
    const monthlyLeaves = props.monthlyLeaves.leaves;
    let leavesMap;
    if (monthlyLeaves && monthlyLeaves.length > 0) {
        leavesMap = hashLeaves(monthlyLeaves);
    }

    const prevMonthURL =
        month == 1
            ? `/monthly-view?year=${year - 1}&month=12`
            : `/monthly-view?year=${year}&month=${month - 1}`;
    const nextMonthURL =
        month == 12
            ? `/monthly-view?year=${year + 1}&month=1`
            : `/monthly-view?year=${year}&month=${month + 1}`;

    const leaveTable = (
        <Table className="monthly-table">
            <thead>
                <tr>
                    <th clasName="monthly-table-header border border-secondary">
                        Dates
                    </th>
                    {personnel.map(person => (
                        <th className="monthly-table-header border border-secondary">
                            {person.name}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {daysArray.map(day => (
                    <tr>
                        <td key={day.format("MM/DD")}>{day.format("MM/DD")}</td>
                        {// Due to the nature of useEffect(), personnel and monthlyLeaves
                        // may be undefined when the component is first rendered
                        // Thus a null/undefined check must be included
                        personnel &&
                            monthlyLeaves &&
                            personnel.length > 0 &&
                            monthlyLeaves.length > 0 &&
                            personnel.map(person => {
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
                                                key={leaveOnDate._id}
                                                leave={leaveOnDate}
                                            />
                                        );
                                    }
                                }
                                return <MonthlyViewTableCell leave={null} />;
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
            <Row className="mb-4">
                <Col
                    sm="2"
                    style={{ display: "flex", "justify-content": "center" }}
                >
                    <Link to={prevMonthURL}>
                        <Button color="primary">
                            <i class="fas fa-arrow-circle-left"></i> Prev
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
                            Next <i class="fas fa-arrow-circle-right"></i>
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col sm="1"></Col>
                <Col sm="10">{leaveTable}</Col>
                <Col sm="1"></Col>
            </Row>
        </Container>
    );
};

MonthlyView.propTypes = {
    personnel: PropTypes.object.isRequired,
    getAllPersonnel: PropTypes.func.isRequired,
    getMonthlyLeaves: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    personnel: state.personnel,
    monthlyLeaves: state.leaves.monthlyLeaves
});

export default connect(mapStateToProps, { getAllPersonnel, getMonthlyLeaves })(
    MonthlyView
);
