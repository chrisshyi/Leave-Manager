import React, { useState } from "react";
import PropTypes from "prop-types";

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
    return (
        <td
            onMouseOver={e => toggleEditIcon(e)}
            onMouseOut={e => toggleEditIcon(e)}
            className="monthly-view-cell"
        >
            {leave.leaveType}{' '}
            {showEditIcon && <i class="far fa-edit"></i>}
        </td>
    );
};

MonthlyViewTableCell.propTypes = {
    leave: PropTypes.object
};

export default MonthlyViewTableCell;
