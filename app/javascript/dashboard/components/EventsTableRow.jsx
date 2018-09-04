import React from "react";

import eventDateString from "../../util/eventDateString";

class EventsTableRow extends React.PureComponent {
  render() {
    const event = this.props.event;
    const monthNames = this.props.strings.date_strings.month_names_short;
    return (
      <tr>
        <td>
          <a href={`/programs/${event.program_id}`}>{event.program_name}</a>
        </td>
        <td>
          <a href={`/programs/${event.program_id}/events/${event.id}`}>
            {event.name}
          </a>
        </td>
        <td>{event.domain}</td>
        <td>{eventDateString(event.start_date, event.end_date, monthNames)}</td>
      </tr>
    );
  }
}

export default EventsTableRow;
