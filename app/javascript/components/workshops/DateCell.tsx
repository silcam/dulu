import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IWorkshop } from "../../models/Workshop";
import { ILanguage } from "../../models/Language";
import { T } from "../../i18n/i18n";
import I18nContext from "../../contexts/I18nContext";
import { AnyObj } from "../../models/TypeBucket";

interface IProps {
  workshop: IWorkshop;
  language: ILanguage;
  canUpdate?: boolean;
}

function dateText(
  date: string | undefined,
  languageId: number,
  eventId: number | null
) {
  return eventId ? (
    <Link to={`/languages/${languageId}/events/${eventId}`}>{date}</Link>
  ) : (
    date
  );
}

function addEventLink(
  eventId: number | null,
  canUpdate: boolean | undefined,
  newEventText: string,
  newEvent: { pathname: string; state: AnyObj }
) {
  return canUpdate && !eventId ? (
    <Link to={newEvent.pathname} state={newEvent.state}>
      {newEventText}
    </Link>
  ) : (
    ""
  );
}

// React Router 5 let location state ride inside the `to` object. In v6 `to` is
// a Partial<Path> -- pathname/search/hash only -- and state is its own <Link>
// prop, so the two travel separately from here on.
function newEventLocation(workshop: IWorkshop, language: ILanguage, t: T) {
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

export default function DateCell(props: IProps) {
  const t = useContext(I18nContext);
  const theDateText = dateText(
    props.workshop.date,
    props.language.id,
    props.workshop.event_id
  );
  const theAddEventLink = addEventLink(
    props.workshop.event_id,
    props.canUpdate,
    t("Add_event"),
    newEventLocation(props.workshop, props.language, t)
  );
  return (
    <div>
      {theDateText}
      {theDateText && theAddEventLink && <br />}
      {theAddEventLink}
    </div>
  );
}
