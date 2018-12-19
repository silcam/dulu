import React from "react";
import PropTypes from "prop-types";
import eventDateString from "../../util/eventDateString";
import { Link } from "react-router-dom";

export default class EventsTableRow extends React.PureComponent {
  render() {
    const event = this.props.event;
    const t = this.props.t;
    const monthNames = this.props.t("month_names_short");
    return (
      <tr>
        <td>
          <Link to={`/programs/${event.program_id}`}>{event.program_name}</Link>
        </td>
        <td>
          <Link to={`/programs/${event.program_id}/events/${event.id}`}>
            {event.name}
          </Link>
        </td>
        <td>{t(`domains.${event.domain}`)}</td>
        <td>{eventDateString(event.start_date, event.end_date, monthNames)}</td>
      </tr>
    );
  }
}

EventsTableRow.propTypes = {
  t: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired
};
