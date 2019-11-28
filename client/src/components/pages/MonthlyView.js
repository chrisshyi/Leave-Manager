import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment';
import { extendMoment } from 'moment-range';
 
const MonthlyView = props => {
    const moment = extendMoment(Moment);

    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().startOf('month').add(1, 'months').subtract(1, 'days');
    const monthRange = moment.range(startOfMonth, endOfMonth);

    const daysArray = Array.from(monthRange.by('day'));
    return (
        <div>
            <h1>Monthly View</h1> 
            <ul>
                {daysArray.map(day => (
                    <li key={day}>{day.format('MM/DD')}</li>
                ))}
            </ul>
        </div>
    )
}

MonthlyView.propTypes = {

}

export default MonthlyView
