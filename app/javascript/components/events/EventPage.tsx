import React from "react";
import EventView from "./EventView";

export interface IProps {
  id: number;
}

export default function EventPage(props: IProps) {
  return <EventView id={props.id} />;
}
