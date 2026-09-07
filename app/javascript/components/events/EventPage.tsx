import React from "react";
import EventView from "./EventView";
import { useParams } from "react-router-dom";

export default function EventPage() {
  return <EventView id={parseInt(useParams().id!)} />;
}
