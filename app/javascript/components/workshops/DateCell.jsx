import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function dateText(date, languageId, eventId) {
  return eventId ? (
    <Link to={`/languages/${languageId}/events/${eventId}`}>{date}</Link>
  ) : (
    date
  );
}

function addEventLink(eventId, canUpdate, newEventText, newEventPath) {
  return canUpdate && !eventId ? (
    <Link to={newEventPath}>{newEventText}</Link>
  ) : (
    ""
  );
}

function newEventLocation(workshop, language, t) {
  return {
    pathname: `/languages/${language.id}/events/new`,
    state: {
      event: {
        languages: [{ id: language.id, name: language.name }],
        domain: "Linguistics",
        name: `${t("Workshop")}: ${workshop.name}`,
        workshop_id: workshop.id
      }
    }
  };
}

export default function DateCell(props) {
  const theDateText = dateText(
    props.workshop.formattedDate,
    props.language.id,
    props.workshop.event_id
  );
  const theAddEventLink = addEventLink(
    props.workshop.event_id,
    props.canUpdate,
    props.t("Add_event"),
    newEventLocation(props.workshop, props.language, props.t)
  );
  return (
    <div>
      {theDateText}
      {theDateText && theAddEventLink && <br />}
      {theAddEventLink}
    </div>
  );
}

DateCell.propTypes = {
  workshop: PropTypes.object.isRequired,
  language: PropTypes.object.isRequired,
  canUpdate: PropTypes.bool,
  t: PropTypes.func.isRequired
};
