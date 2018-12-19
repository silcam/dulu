import React from "react";
import { Link } from "react-router-dom";

/*
    Required props:
        string date
        string eventPath
        string newEventPath
        boolean canUpdate
*/

function dateText(date, eventPath) {
  return eventPath ? <Link to={eventPath}>{date}</Link> : date;
}

function addEventLink(eventPath, canUpdate, newEventText, newEventPath) {
  return canUpdate && !eventPath ? (
    <Link to={newEventPath}>{newEventText}</Link>
  ) : (
    ""
  );
}

function DateCell(props) {
  const theDateText = dateText(props.date, props.eventPath);
  const theAddEventLink = addEventLink(
    props.eventPath,
    props.canUpdate,
    props.t("Add_event"),
    props.newEventPath
  );
  return (
    <div>
      {theDateText}
      {theDateText && theAddEventLink && <br />}
      {theAddEventLink}
    </div>
  );
}

export default DateCell;
