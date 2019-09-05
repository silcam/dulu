import React, { useContext } from "react";
import eventDateString from "../../util/eventDateString";
import { monthName, IMonth } from "./dateUtils";
import FuzzyDate from "../../util/FuzzyDate";
import style from "./EventsCalendar.css";
import { Link } from "react-router-dom";
import { fullName, IPerson } from "../../models/Person";
import I18nContext from "../../contexts/I18nContext";
import { ILanguage } from "../../models/Language";
import { ICluster } from "../../models/Cluster";
import { IEvent } from "../../models/Event";
import List from "../../models/List";
import Truncate from "../shared/Truncate";

interface IProps {
  events: List<IEvent>;
  people: List<IPerson>;
  languages: List<ILanguage>;
  clusters: List<ICluster>;
  month: IMonth;
}

export default function MonthColumn(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <div>
      <h2>{monthName(props.month.month, t) + " " + props.month.year}</h2>
      {props.events.map((event, index) => (
        <div key={event.id}>
          <h3 className={style.dateTitle}>{dateTitle(event, props.month)}</h3>
          <h4 className={style.eventTitle}>
            <Link to={`/events/${event.id}`}>{event.name}</Link>
          </h4>
          {eventDateString(
            event.start_date,
            event.end_date,
            t("month_names_short")
          )}
          <p>{participants(event, props)}</p>
          <p>
            <Truncate text={event.note} limit={500} />
          </p>
          {index < props.events.length() - 1 && <hr />}
        </div>
      ))}
    </div>
  );
}

function dateTitle(event: IEvent, month: IMonth) {
  let days = [event.start_date, event.end_date].map(dateStr => {
    const date = FuzzyDate.toObject(dateStr);
    return date.year == month.year && date.month == month.month
      ? date.day
      : undefined;
  });
  if (days[0] && days[0] == days[1]) return days[0];
  return (days[0] ? days[0] : "<") + " - " + (days[1] ? days[1] : ">");
}

function participants(event: IEvent, props: IProps) {
  const clusterLinks = makeLinks(
    event.cluster_ids.map(id => props.clusters.get(id)),
    "clusters"
  );
  const languageLinks = makeLinks(
    event.language_ids.map(id => props.languages.get(id)),
    "languages"
  );
  const peopleLinks = makeLinks(
    event.event_participants.map(e_p => ({
      id: e_p.person_id,
      name: fullName(props.people.get(e_p.person_id))
    })),
    "people"
  );
  return clusterLinks.concat(languageLinks).concat(peopleLinks);
}

function makeLinks<T extends { id: number; name: string }>(
  list: T[],
  type: string
) {
  const baseUrl = "/" + type;
  return list.map(item => {
    return (
      <span key={type + item.id} className={style.linkListItem}>
        <Link to={`${baseUrl}/${item.id}`}>{item.name}</Link>
      </span>
    );
  });
}
