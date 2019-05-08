import React, { useContext } from "react";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import EventRow from "./EventRow";
import { IEvent } from "../../models/Event";
import I18nContext from "../../contexts/I18nContext";
import { History } from "history";
import StyledTable from "../shared/StyledTable";

interface EventsByYear {
  [year: string]: IEvent[];
}

interface IProps {
  events: IEvent[];
  basePath?: string;
  can: { create?: boolean };
  noAdd?: boolean;
  history?: History; // Not required if noAdd is set
  moreEventsState: "none" | "loading" | "button";
  moreEvents: () => void;
  noHeader?: boolean;
}

export default function BasicEventsTable(props: IProps) {
  const yearGroups = (): EventsByYear => {
    return props.events.reduce((accum: EventsByYear, event) => {
      const year = event.start_date.slice(0, 4);
      if (!accum[year]) accum[year] = [];
      accum[year].push(event);
      return accum;
    }, {});
  };

  const t = useContext(I18nContext);
  const years = yearGroups();
  const basePath = props.basePath || "";

  return (
    <div>
      {!props.noHeader && (
        <h3>
          {t("Events")}
          {props.can.create && !props.noAdd && (
            <InlineAddIcon
              onClick={() => props.history!.push(`${basePath}/events/new`)}
            />
          )}
        </h3>
      )}
      <StyledTable>
        <tbody>
          {Object.keys(years)
            .sort()
            .reverse()
            .map(year => (
              <React.Fragment key={year}>
                <tr>
                  <th colSpan={2}>{year}</th>
                </tr>
                {years[year].map(event => (
                  <EventRow key={event.id} event={event} basePath={basePath} />
                ))}
              </React.Fragment>
            ))}
          {props.moreEventsState != "none" && (
            <tr>
              <td>
                {props.moreEventsState == "loading" ? (
                  t("Loading")
                ) : (
                  <button
                    className="link"
                    onClick={props.moreEvents}
                    style={{ fontWeight: "bold" }}
                  >
                    {t("More_events")}
                  </button>
                )}
              </td>
              <td />
            </tr>
          )}
        </tbody>
      </StyledTable>
    </div>
  );
}
