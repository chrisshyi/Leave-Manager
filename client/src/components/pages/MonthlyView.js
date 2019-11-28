import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { getAllPersonnel } from "../../actions/personnel";
import { connect } from "react-redux";
import setAuthToken from '../../utils/setAuthToken';

const MonthlyView = props => {
    useEffect(() => {
        props.getAllPersonnel();
    }, []);
    const { personnel } = props.personnel;
    const moment = extendMoment(Moment);

    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment()
        .startOf("month")
        .add(1, "months")
        .subtract(1, "days");
    const monthRange = moment.range(startOfMonth, endOfMonth);

    const daysArray = Array.from(monthRange.by("day"));
    return (
        <div>
            <h1>Monthly View</h1>
            <ul>
                {daysArray.map(day => (
                    <li key={day}>{day.format("MM/DD")}</li>
                ))}
            </ul>
        </div>
    );
};

MonthlyView.propTypes = {
    personnel: PropTypes.object.isRequired,
    getAllPersonnel: PropTypes.func.isRequired, 
};

const mapStateToProps = state => ({
    personnel: state.personnel
});

export default connect(mapStateToProps, { getAllPersonnel })(MonthlyView);