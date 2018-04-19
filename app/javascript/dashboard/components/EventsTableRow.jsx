import React from 'react'

import dateString from '../../util/dateString'

class EventsTableRow extends React.PureComponent {
    render() {
        const event = this.props.event
        const monthNames = this.props.strings.date_strings.month_names_short
        return (
            <tr>
                <td>
                    <a href={`/programs/${event.programId}`}>
                        {event.programName}
                    </a>        
                </td>
                <td>
                    <a href={`/programs/${event.programId}/events/${event.id}`}>
                        {event.name}
                    </a>
                </td>
                <td>
                    {event.domain}
                </td>
                <td>
                    {dateString(event.startDate, monthNames)}
                    {(event.startDate != event.endDate) && 
                        <span> - {dateString(event.endDate, monthNames)}</span>
                    }
                </td>
            </tr>
        )
    }
}

export default EventsTableRow