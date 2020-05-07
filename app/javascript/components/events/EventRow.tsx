import React, { useContext } from "react";
import eventDateString from "../../util/eventDateString";
import { truncate } from "../../util/stringUtils";
import { Link } from "react-router-dom";
import NoteIcon from "../../components/shared/icons/NoteIcon";
import { IEvent } from "../../models/Event";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  event: IEvent;
  basePath: string;
}

export default function EventRow(props: IProps) {
  const t = useContext(I18nContext);
  const event = props.event;
  return (
    <tr>
      <td>
        <Link to={`${props.basePath}/events/${event.id}`}>{event.name}</Link>
        {event.note && event.note.length > 0 ? (
          <NoteIcon
            hovertext={truncate(event.note)}
            valign={"middle"}
            position={"right"}
          />
        ) : (
          ""
        )}
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
