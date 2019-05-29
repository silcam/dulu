import React from "react";
import EventContainer from "../events/EventContainer";
import { ILanguage } from "../../models/Language";
import { History } from "history";
import { LanguageBackLink } from "../shared/BreadCrumbs";

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

      <EventContainer id={props.eventId} history={props.history} />
    </div>
  );
}
