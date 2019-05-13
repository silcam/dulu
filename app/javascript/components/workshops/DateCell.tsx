import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IWorkshop } from "../../models/Workshop";
import { ILanguage } from "../../models/Language";
import { T } from "../../i18n/i18n";
import I18nContext from "../../contexts/I18nContext";
import { LocationDescriptorObject } from "history";

interface IProps {
  workshop: IWorkshop;
  language: ILanguage;
  canUpdate?: boolean;
}

function dateText(
  date: string | null,
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
  newEventPath: string | LocationDescriptorObject
) {
  return canUpdate && !eventId ? (
    <Link to={newEventPath}>{newEventText}</Link>
  ) : (
    ""
  );
}

function newEventLocation(
  workshop: IWorkshop,
  language: ILanguage,
  t: T
): LocationDescriptorObject {
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
    props.workshop.formattedDate,
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
