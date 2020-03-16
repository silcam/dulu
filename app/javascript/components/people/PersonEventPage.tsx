import React from "react";
import { PersonBackLink } from "../shared/BreadCrumbs";
import useAppSelector from "../../reducers/useAppSelector";
import EventView from "../events/EventView";

interface IProps {
  id: number;
  eventId: number;
}

export default function LanguageEventPage(props: IProps) {
  const person = useAppSelector(state => state.people.get(props.id));

  return (
    <div>
      <PersonBackLink person={person} />

      <EventView id={props.eventId} />
    </div>
  );
}
