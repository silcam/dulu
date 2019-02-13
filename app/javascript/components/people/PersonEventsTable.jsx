import React from "react";
import PropTypes from "prop-types";
import EventsTable from "../events/EventsTable";

export default function PersonEventsTable(props) {
  return (
    <EventsTable
      {...props}
      eventsUrl={`/api/people/${props.person.id}/events`}
      addEventsFor={(events, period) =>
        props.addEventsForPerson(events, props.person, period)
      }
      noAdd
    />
  );
}

PersonEventsTable.propTypes = {
  person: PropTypes.object.isRequired,
  addEventsForPerson: PropTypes.func.isRequired
};
