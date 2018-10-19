import React from "react";
import PropTypes from "prop-types";
import eventDateString from "../../util/eventDateString";

export default function EventsTable(props) {
  const events = domainEvents(props.language.events, props.tab);
  return (
    <div>
      <h3>{props.t("Events")}</h3>
      <table>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>
                {eventDateString(
                  event.start_date,
                  event.end_date,
                  props.t("month_names_short")
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function domainEvents(allEvents, domain) {
  let events = [];
  events = events.concat(allEvents.upcoming.filter(e => e.domain == domain));
  events = events.concat(allEvents.current.filter(e => e.domain == domain));
  return events;
}

EventsTable.propTypes = {
  language: PropTypes.object.isRequired,
  tab: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};
