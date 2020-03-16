import React from "react";
import { ILanguage } from "../../models/Language";
import { History } from "history";
import { LanguageBackLink } from "../shared/BreadCrumbs";
import EventView from "../events/EventView";

interface IProps {
  language: ILanguage;
  eventId: number;
  basePath: string;

  history: History;
}

export default function LanguageEventPage(props: IProps) {
  const language = props.language;

  return (
    <div>
      <LanguageBackLink language={language} />

      <EventView id={props.eventId} />
    </div>
  );
}
