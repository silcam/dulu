import React from "react";
import PropTypes from "prop-types";
import eventDateString from "../../util/eventDateString";

export default function MonthColumn(props) {
  return (
    <div>
      <h3>{monthName(props.month, props.t)}</h3>
      {props.events.map(event => (
        <div key={event.id}>
          <b>{event.name}</b>
          <br />
          {eventDateString(
            event.start_date,
            event.end_date,
            props.t("month_names_short")
          )}
        </div>
      ))}
    </div>
  );
}

function monthName(month, t) {
  return t("month_names_short")[month.month - 1] + " " + month.year;
}

MonthColumn.propTypes = {
  events: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  month: PropTypes.object.isRequired
};
