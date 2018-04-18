import React from 'react'

import EventsTableRow from './EventsTableRow'

function EventsTableSection(props) {
    return (
        <React.Fragment>
            {props.events.length > 0 &&
                <tr>
                    <th colSpan='3'>{props.sectionTitle}</th>
                </tr>
            }
            {props.events.map((event) => {
                if (!props.filter[event.domain]) return null
                return (
                    <EventsTableRow key={`${event.programId}-${event.id}`} event={event}
                                    strings={props.strings} />
                )
            })}
        </React.Fragment>
    )
}

export default EventsTableSection