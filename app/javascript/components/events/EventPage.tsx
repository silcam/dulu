import React from "react";
import EventContainer from "./EventContainer";
import { History } from "history";

export interface IProps {
  id: number;
  history: History;
}

export default function EventPage(props: IProps) {
  return <EventContainer id={props.id} history={props.history} />;
}
