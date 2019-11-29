import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { getAllPersonnel } from "../../actions/personnel";
import { connect } from "react-redux";
import { Table } from "reactstrap";
import { getMonthlyLeaves } from "../../actions/leaves";

const hashLeaves = leavesArr => {
    let leavesMap = new Map();

    for (let leave of leavesArr) {
        let leaveDate = Moment(leave.scheduledDate);
        if (!leavesMap.has(leave.personnel._id)) {
            leavesMap.set(leave.personnel._id, new Map());
        }
        leavesMap
            .get(leave.personnel._id)
            .set(
                leaveDate.format('MM/DD'),
                leave
            );
    }
    return leavesMap;
};

const MonthlyView = props => {
    useEffect(() => {
        props.getAllPersonnel();
    }, [getAllPersonnel]);
    useEffect(() => {
        props.getMonthlyLeaves();
    }, [getMonthlyLeaves]);
    const { personnel } = props.personnel;
    const moment = extendMoment(Moment);

    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment()
        .startOf("month")
        .add(1, "months")
        .subtract(1, "days");
    const monthRange = moment.range(startOfMonth, endOfMonth);

    const daysArray = Array.from(monthRange.by("day"));
    const monthlyLeaves = props.monthlyLeaves.leaves;
    let leavesMap;
    if (monthlyLeaves && monthlyLeaves.length > 0) {
        leavesMap = hashLeaves(monthlyLeaves);
    }

    const leaveTable = (
        <Table>
            <thead>
                <tr>
                    <th>Dates</th>
                    {personnel.map(person => (
                        <th>{person.name}</th>
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
                                    const dateLeaveMap = leavesMap.get(person._id);
                                    if (dateLeaveMap.has(dateStr)) {
                                        const leaveOnDate = dateLeaveMap.get(dateStr);
                                        return <td key={leaveOnDate._id}>{leaveOnDate.leaveType}</td>
                                    }
                                }
                                return <td>Empty</td>;
                            })}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
    return (
        <div>
            <h1>Monthly View</h1>
            {leaveTable}
        </div>
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
