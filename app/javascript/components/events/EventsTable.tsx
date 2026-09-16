import React, { useEffect, useState } from "react";
import DuluAxios from "../../util/DuluAxios";
import { lastYear } from "../../util/Date";
import BasicEventsTable from "./BasicEventsTable";
import { IEvent, IPeriod } from "../../models/Event";
import { Adder, SetCan } from "../../models/TypeBucket";
import { IPerson } from "../../models/Person";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import { ICan } from "../../actions/canActions";
import List from "../../models/List";

export interface IProps {
  events: List<IEvent>;
  basePath: string;
  addPeople: Adder<IPerson>;
  addClusters: Adder<ICluster>;
  addLanguages: Adder<ILanguage>;
  setCan: SetCan;
  can: ICan;
  eventsBackTo?: number; // a year
  // Comes from immediate parent:
  eventsUrl: string;
  addEventsFor: (events: IEvent[], period: IPeriod) => void;
  noAdd?: boolean;
}

export default function EventsTable(props: IProps) {
  const [loadingMore, setLoadingMore] = useState(false);

  const getEvents = async ({ initialGet = false }) => {
    setLoadingMore(true);
    const period =
      !initialGet && props.eventsBackTo
        ? {
            start_year: props.eventsBackTo - 3,
            end_year: props.eventsBackTo - 1
          }
        : { start_year: lastYear() };
    const data = await DuluAxios.get(props.eventsUrl, period);
    if (data) {
      props.addPeople(data.people);
      props.addClusters(data.clusters);
      props.addLanguages(data.languages);
      props.setCan("events", data.can.events);
      props.addEventsFor(data.events, {
        start: data.startYear ? { year: data.startYear } : undefined,
        end: period.end_year ? { year: period.end_year } : undefined
      });
    }
    setLoadingMore(false);
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps --
     Deliberate, both of them, and a block rather than a disable-next-line because the
     two rules report on different lines: the setState on the call below, the
     dependency list on the line after it.

     getEvents begins with setLoadingMore(true), and the extra render pass that
     triggers is the one that draws the spinner. The rule cannot tell a loading flag
     -- a fact about an in-flight request, which is exactly what state is for -- apart
     from state that should have been derived.

     The dependency list is [] because this is a fetch-once-on-mount. getEvents is
     redefined every render, so listing it would refire the effect every render; and a
     useCallback honest about what it closes over (props.eventsUrl, props.eventsBackTo
     and five props.add* callbacks) would change identity whenever the parent
     re-rendered and refetch, which is a behaviour change rather than a lint fix. */
  useEffect(() => {
    getEvents({ initialGet: true });
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  return (
    <BasicEventsTable
      events={props.events}
      basePath={props.basePath}
      can={props.can}
      noAdd={props.noAdd}
      moreEventsState={
        loadingMore ? "loading" : props.eventsBackTo ? "button" : "none"
      }
      moreEvents={() => getEvents({})}
      noHeader={props.events.length() === 0 && props.noAdd}
    />
  );
}
