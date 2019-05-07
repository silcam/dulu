import React, { useContext } from "react";
import eventDateString from "../../util/eventDateString";
import { Link } from "react-router-dom";
import { IEvent } from "../../models/Event";
import I18nContext from "../../application/I18nContext";

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
