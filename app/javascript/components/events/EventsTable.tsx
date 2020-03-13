import React, { useEffect, useState } from "react";
import DuluAxios from "../../util/DuluAxios";
import { lastYear } from "../../util/Date";
import BasicEventsTable from "./BasicEventsTable";
import { IEvent, IPeriod } from "../../models/Event";
import { History } from "history";
import { Adder, SetCan } from "../../models/TypeBucket";
import { IPerson } from "../../models/Person";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import { ICan } from "../../actions/canActions";
import List from "../../models/List";

export interface IProps {
  events: List<IEvent>;
  basePath: string;
  history: History;
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

  useEffect(() => {
    getEvents({ initialGet: true });
  }, []);

  return (
    <BasicEventsTable
      events={props.events}
      basePath={props.basePath}
      can={props.can}
      noAdd={props.noAdd}
      history={props.history}
      moreEventsState={
        loadingMore ? "loading" : props.eventsBackTo ? "button" : "none"
      }
      moreEvents={() => getEvents({})}
      noHeader={props.events.length() === 0 && props.noAdd}
    />
  );
}
