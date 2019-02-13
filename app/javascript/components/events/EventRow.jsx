import React from "react";
import PropTypes from "prop-types";
import eventDateString from "../../util/eventDateString";
import { Link } from "react-router-dom";

export default function EventRow(props) {
  const t = props.t;
  const event = props.event;
  return (
    <tr>
      <td>
        <Link to={`${props.basePath}/events/${event.id}`}>{event.name}</Link>
      </td>
      <td>
        {eventDateString(
          event.start_date,
          event.end_date,
          t("month_names_short")
        )}
      </td>
    </tr>
  );
}

EventRow.propTypes = {
  t: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired
};
