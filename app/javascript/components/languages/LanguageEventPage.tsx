import React from "react";
import { ILanguage } from "../../models/Language";
import { LanguageBackLink } from "../shared/BreadCrumbs";
import EventView from "../events/EventView";

interface IProps {
  language: ILanguage;
  eventId: number;
  basePath: string;

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
