import React from "react";
import EventContainer from "../events/EventContainer";
import { Link } from "react-router-dom";
import { ILanguage } from "../../models/Language";
import { History } from "history";

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
      <h4>
        <Link to={props.basePath}>{`< ${language.name}`}</Link>
      </h4>

      <EventContainer id={props.eventId} history={props.history} />
    </div>
  );
}
