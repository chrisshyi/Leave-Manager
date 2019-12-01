import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from 'moment';

const MonthlyViewTableCell = props => {
    const [showEditIcon, setShowEditIcon] = useState(false);
    const { leave } = props;

    const toggleEditIcon = e => {
        setShowEditIcon(!showEditIcon);
    };

    if (leave === null) {
        return (
            <td
                onMouseOver={e => toggleEditIcon(e)}
                onMouseOut={e => toggleEditIcon(e)}
                className="monthly-view-cell"
            >
                {" "}
                {showEditIcon && <i class="far fa-edit"></i>}
            </td>
        );
    }
    
    let leaveDisplay = leave.leaveType;
    if (leave.leaveType === '例假') {
        const originalDate = moment(leave.originalDate);
        const scheduledDate = moment(leave.scheduledDate);
        if (scheduledDate.isBefore(originalDate)) {
            leaveDisplay = `預${originalDate.format('MM/DD')}` 
        } else if (scheduledDate.isAfter(originalDate)) {
            leaveDisplay = `補${originalDate.format('MM/DD')}` 
        }
    }
    return (
        <td
            onMouseOver={e => toggleEditIcon(e)}
            onMouseOut={e => toggleEditIcon(e)}
            className="monthly-view-cell"
        >
            {leaveDisplay} {showEditIcon && <i class="far fa-edit"></i>}
        </td>
    );
};

MonthlyViewTableCell.propTypes = {
    leave: PropTypes.object
};

export default MonthlyViewTableCell;
