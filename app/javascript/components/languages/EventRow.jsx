import React from "react";
import PropTypes from "prop-types";
import eventDateString from "../../util/eventDateString";
import style from "./EventsTable.css";
import EventsParticipantsTable from "../events/EventsParticipantsTable";
import { Link } from "react-router-dom";

/*
  Expanded state is deprecated
*/

export default class EventRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  render() {
    const t = this.props.t;
    const event = this.props.event;
    return (
      <React.Fragment>
        <tr>
          <td className={this.state.expanded ? style.eventTitle : undefined}>
            <Link to={`/events/${event.id}`}>{event.name}</Link>
          </td>
          <td>
            {eventDateString(
              event.start_date,
              event.end_date,
              t("month_names_short")
            )}
          </td>
        </tr>
        {this.state.expanded && (
          <tr>
            <td className={style.rowExpansion} colSpan="2">
              <div>
                {event.note && <p>{event.note}</p>}
                <EventsParticipantsTable event={event} t={t} />
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  }
}

EventRow.propTypes = {
  t: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired
};
