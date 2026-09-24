import React from "react";
import { PersonBackLink } from "../shared/BreadCrumbs";
import useAppSelector from "../../reducers/useAppSelector";
import EventView from "../events/EventView";
import { useParams } from "react-router-dom";

export default function PersonEventPage() {
  const params = useParams();
  const person = useAppSelector(state =>
    state.people.get(parseInt(params.id!))
  );

  return (
    <div>
      <PersonBackLink person={person} />

      <EventView id={parseInt(params.eventId!)} />
    </div>
  );
}
