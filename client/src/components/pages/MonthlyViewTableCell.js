import React from "react";
import PropTypes from "prop-types";

const MonthlyViewTableCell = props => {
    const { leave } = props;
    if (leave === null) {
        return <td className="monthly-view-cell">{' '}</td>;
    }
    return <td className="monthly-view-cell">{leave.leaveType}</td>;
};

MonthlyViewTableCell.propTypes = {
    leave: PropTypes.object
};

export default MonthlyViewTableCell;
