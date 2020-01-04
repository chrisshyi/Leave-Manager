import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { toggleModal } from "../../actions/modals";
import { getAvailableLeaves } from "../../actions/leaves";
import { connect } from "react-redux";

/** @function
 * Renders a cell in the monthly view table. Has a reference 
 * to a particular leave
 * @param {object} props 
 */
const MonthlyViewTableCell = props => {
    const [showEditIcon, setShowEditIcon] = useState(false);
    const { leave, toggleModal, getAvailableLeaves, date, personnel } = props;

    const toggleEditIcon = e => {
        setShowEditIcon(!showEditIcon);
    };

    if (leave === null) {
        return (
            <td
                onMouseOver={e => toggleEditIcon(e)}
                onMouseOut={e => toggleEditIcon(e)}
                className="leave-table-cell"
                onClick={e => {
                    getAvailableLeaves(personnel);
                    toggleModal(true, null, date, true);
                }}

            >
                {" "}
                {showEditIcon && <i className="far fa-edit"></i>}
            </td>
        );
    }

    let leaveDisplay = leave.leaveType;
    if (leave.leaveType === "例假") {
        const originalDate = moment(leave.originalDate);
        const scheduledDate = moment(leave.scheduledDate);
        if (scheduledDate.isBefore(originalDate)) {
            leaveDisplay = `預${originalDate.format("MM/DD")}`;
        } else if (scheduledDate.isAfter(originalDate)) {
            leaveDisplay = `補${originalDate.format("MM/DD")}`;
        }
    }
    return (
        <td
            onMouseOver={e => toggleEditIcon(e)}
            onMouseOut={e => toggleEditIcon(e)}
            className="leave-table-cell"
                onClick={e => {
                    toggleModal(true, leave, date, false);
                }}
        >
            {leaveDisplay}{" "}
            {showEditIcon && <i className="far fa-times-circle"></i>}
        </td>
    );
};

MonthlyViewTableCell.propTypes = {
    leave: PropTypes.object,
    date: PropTypes.object.isRequired // Moment object!
};

export default connect(null, { toggleModal, getAvailableLeaves })(MonthlyViewTableCell);
