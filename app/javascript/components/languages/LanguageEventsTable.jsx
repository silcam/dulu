import React from "react";
import PropTypes from "prop-types";
import EventsTable from "../events/EventsTable";

export default function LanguageEventsTable(props) {
  return (
    <EventsTable
      {...props}
      eventsUrl={`/api/languages/${props.language.id}/events`}
      addEventsFor={(events, period) =>
        props.addEventsForLanguage(events, props.language.id, period)
      }
    />
  );
}

LanguageEventsTable.propTypes = {
  language: PropTypes.object.isRequired,
  addEventsForLanguage: PropTypes.func.isRequired
};
