import React from "react";
import EventsTable from "../events/EventsTable";
import { IPerson } from "../../models/Person";
import { IAddEventsForPerson } from "../../actions/eventActions";
import { History } from "history";
import { Adder, SetCan } from "../../models/TypeBucket";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import { ICan } from "../../actions/canActions";
import { IEvent } from "../../models/Event";
import List from "../../models/List";

interface IProps {
  person: IPerson;
  addEventsForPerson: IAddEventsForPerson;
  basePath: string;
  history: History;
  addPeople: Adder<IPerson>;
  addClusters: Adder<ICluster>;
  addLanguages: Adder<ILanguage>;
  setCan: SetCan;
  can: ICan;
  events: List<IEvent>;
}

export default function PersonEventsTable(props: IProps) {
  return (
    <EventsTable
      {...props}
      eventsUrl={`/api/people/${props.person.id}/events`}
      addEventsFor={(events, period) =>
        props.addEventsForPerson(events, props.person, period)
      }
      noAdd
    />
  );
}
