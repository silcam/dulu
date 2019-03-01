import React from "react";
import { Link } from "react-router-dom";
import ParticipantContainer from "./ParticipantContainer";
import { ILanguage } from "../../models/Language";

interface IProps {
  language: ILanguage;
  basePath: string;
  participantId: number;
}

export default function LanguageParticipantPage(props: IProps) {
  const language = props.language;

  return (
    <div>
      <h4>
        <Link to={props.basePath}>{`< ${language.name}`}</Link>
      </h4>

      <ParticipantContainer {...props} id={props.participantId} />
    </div>
  );
}
