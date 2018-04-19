import React from 'react'

import EventsTableRow from './EventsTableRow'

function EventsTableSection(props) {
    const filteredEvents = props.events.filter((event) => {
        return props.domainFilter == 'All' || event.domain == props.domainFilter
    })
    return (
        <React.Fragment>
            {filteredEvents.length > 0 &&
                <tr>
                    <th colSpan='4'>{props.sectionTitle}</th>
                </tr>
            }
            {filteredEvents.map((event) => {
                return (
                    <EventsTableRow key={`${event.programId}-${event.id}`} event={event}
                                    strings={props.strings} />
                )
            })}
        </React.Fragment>
    )
}

export default EventsTableSection