import React from "react";
import { History } from "history";
import EventView from "./EventView";

export interface IProps {
  id: number;
  history: History;
}

export default function EventPage(props: IProps) {
  return <EventView id={props.id} />;
}
