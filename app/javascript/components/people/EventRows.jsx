import React from "react";

import eventDateString from "../../util/eventDateString";

function EventRows(props) {
  const events = props.events;
  const t = props.t;

  return (
    <React.Fragment>
      {events.map(event => {
        const rowClass = props.pastEvents ? "text-muted" : "";
        return (
          <tr key={event.id} className={rowClass}>
            <td>
              <a href={`/events/${event.id}`}>{event.name}</a>
            </td>
            <td>
              {eventDateString(
                event.start_date,
                event.end_date,
                t("date_strings.month_names_short")
              )}
            </td>
            <td className="subtle-links">
              {event.cluster_programs.map((program, index) => {
                return (
                  <React.Fragment key={program.path}>
                    <a href={program.path}>{program.name}</a>
                    {index < event.cluster_programs.length - 1 && ", "}
                  </React.Fragment>
                );
              })}
            </td>
          </tr>
        );
      })}
    </React.Fragment>
  );
}

export default EventRows;
