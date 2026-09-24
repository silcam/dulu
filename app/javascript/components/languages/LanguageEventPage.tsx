import React from "react";
import { LanguageBackLink } from "../shared/BreadCrumbs";
import EventView from "../events/EventView";
import { useLanguageContext } from "./LanguagePageRouter";
import { useParams } from "react-router-dom";

export default function LanguageEventPage() {
  const { language } = useLanguageContext();
  const eventId = parseInt(useParams().eventId!);

  return (
    <div>
      <LanguageBackLink language={language} />

      <EventView id={eventId} />
    </div>
  );
}
