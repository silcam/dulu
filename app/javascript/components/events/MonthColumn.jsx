import React from "react";
import PropTypes from "prop-types";
import eventDateString from "../../util/eventDateString";
import { monthName } from "./dateUtils";
import FuzzyDate from "../../util/FuzzyDate";
import style from "./EventsCalendar.css";
import { Link } from "react-router-dom";

export default function MonthColumn(props) {
  return (
    <div>
      <h2>{monthName(props.month.month, props.t) + " " + props.month.year}</h2>
      {props.events.map((event, index) => (
        <div key={event.id}>
          <h3 className={style.dateTitle}>{dateTitle(event, props.month)}</h3>
          <h4 className={style.eventTitle}>
            <Link to={`/events/${event.id}`}>{event.name}</Link>
          </h4>
          {eventDateString(
            event.start_date,
            event.end_date,
            props.t("month_names_short")
          )}
          <p>{participants(event)}</p>
          <p>{event.note}</p>
          {index < props.events.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
}

function dateTitle(event, month) {
  let days = [event.start_date, event.end_date].map(dateStr => {
    const date = FuzzyDate.toObject(dateStr);
    return date.year == month.year && date.month == month.month
      ? date.day
      : undefined;
  });
  if (days[0] && days[0] == days[1]) return days[0];
  return (days[0] ? days[0] : "<") + " - " + (days[1] ? days[1] : ">");
}

function participants(event) {
  const clusterLinks = makeLinks(event.clusters, "clusters");
  const languageLinks = makeLinks(event.programs, "languages");
  const peopleLinks = makeLinks(event.event_participants, "people");
  return clusterLinks.concat(languageLinks).concat(peopleLinks);
}

function makeLinks(list, type) {
  const baseUrl = "/" + type;
  return list.map(item => {
    const id = type == "people" ? item.person_id : item.id;
    const name = type == "people" ? item.full_name : item.name;
    return (
      <span key={type + id} className={style.linkListItem}>
        <Link to={`${baseUrl}/${id}`}>{name}</Link>
      </span>
    );
  });
}

MonthColumn.propTypes = {
  events: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  month: PropTypes.object.isRequired
};
