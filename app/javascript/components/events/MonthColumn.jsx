import React from "react";
import PropTypes from "prop-types";
import eventDateString from "../../util/eventDateString";
import { monthName } from "./dateUtils";
import FuzzyDate from "../../util/FuzzyDate";
import style from "./EventsCalendar.css";
import { Link } from "react-router-dom";
import { fullName } from "../../models/person";

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
          <p>{participants(event, props)}</p>
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

function participants(event, props) {
  const clusterLinks = makeLinks(
    event.cluster_ids.map(id => ({ id: id, name: props.clusters[id].name })),
    "clusters"
  );
  const languageLinks = makeLinks(
    event.language_ids.map(id => ({ id: id, name: props.languages[id].name })),
    "languages"
  );
  const peopleLinks = makeLinks(
    event.event_participants.map(e_p => ({
      id: e_p.person_id,
      name: fullName(props.people[e_p.person_id])
    })),
    "people"
  );
  return clusterLinks.concat(languageLinks).concat(peopleLinks);
}

function makeLinks(list, type) {
  const baseUrl = "/" + type;
  return list.map(item => {
    return (
      <span key={type + item.id} className={style.linkListItem}>
        <Link to={`${baseUrl}/${item.id}`}>{item.name}</Link>
      </span>
    );
  });
}

MonthColumn.propTypes = {
  events: PropTypes.array.isRequired,
  people: PropTypes.object.isRequired,
  languages: PropTypes.object.isRequired,
  clusters: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  month: PropTypes.object.isRequired
};
