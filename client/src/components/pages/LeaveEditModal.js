import React, { useState } from "react";
import PropTypes from "prop-types";

const LeaveEditModal = props => {
    const [isRegularHoliday, setIsRegularHoliday] = useState(false);
    return <div></div>;
};

LeaveEditModal.propTypes = {
    leave: PropTypes.object
};

export default LeaveEditModal;
