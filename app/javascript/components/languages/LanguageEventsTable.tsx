import React from "react";
import EventsTable, { IProps as EventsTableProps } from "../events/EventsTable";
import { ILanguage } from "../../models/Language";
import { AddEventsForLanguage } from "../../actions/eventActions";
import { Omit } from "../../models/TypeBucket";

type NeededEventsTableProps = Omit<
  Omit<EventsTableProps, "eventsUrl">,
  "addEventsFor"
>;

interface IProps extends NeededEventsTableProps {
  language: ILanguage;
  addEventsForLanguage: AddEventsForLanguage;
}

export default function LanguageEventsTable(props: IProps) {
  return (
    <EventsTable
      {...props}
      eventsUrl={`/api/languages/${props.language.id}/events`}
      addEventsFor={(events, period) =>
        props.addEventsForLanguage(events, props.language.id, period)
      }
    />
  );
}
