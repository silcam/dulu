import React from "react";
import update from "immutability-helper";
import { Link } from "react-router-dom";
import { IEvent } from "../../models/Event";
import DeleteIcon from "../shared/icons/DeleteIcon";
import { EventSearchTextInput, SearchItem } from "../shared/SearchTextInput";
import useTranslation from "../../i18n/useTranslation";

interface IProps {
  editing?: boolean;
  replaceEvent: (event: IEvent) => void;
  event: IEvent;
}

export default function EventSeriesTable(props: IProps) {
  const t = useTranslation();

  const removeEventFromDocket = (id: number) => {
    const new_dockets = props.event.dockets.filter(p => p.id != id);
    props.replaceEvent(update(props.event, { dockets: { $set: new_dockets } }));
  };

  const addEventToDocket = (event: SearchItem) => {
    props.replaceEvent(
      update(props.event, {
        dockets: { $push: [{ series_event_id: event.id, name: event.name }] }
      })
    );
  };

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <strong>{t("Other_events_in_this_series")}</strong>
            </td>
          </tr>
          <tr>
            <td>
              {props.event.dockets.length == 0 ? (
                "None"
              ) : (
                <ul>
                  {props.event.dockets.map(item => (
                    <li key={item.series_event_id}>
                      <Link to={`/events/${item.series_event_id}`}>
                        {item.name}
                      </Link>
                      {props.editing ? (
                        <DeleteIcon
                          onClick={() => {
                            removeEventFromDocket(item.id);
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </td>
          </tr>
          <tr>
            <td>
              {props.editing ? (
                <EventSearchTextInput
                  placeholder={"Select an Event"}
                  updateValue={event => {
                    if (event) {
                      addEventToDocket(event);
                    } else {
                      null;
                    }
                  }}
                />
              ) : (
                ""
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
