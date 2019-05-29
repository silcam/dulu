import React from "react";
import ParticipantContainer from "./ParticipantContainer";
import { ILanguage } from "../../models/Language";
import { History } from "history";
import { LanguageBackLink } from "../shared/BreadCrumbs";

interface IProps {
  language: ILanguage;
  basePath: string;
  participantId: number;
  history: History;
}

export default function LanguageParticipantPage(props: IProps) {
  const language = props.language;

  return (
    <div>
      <LanguageBackLink language={language} />

      <ParticipantContainer {...props} id={props.participantId} />
    </div>
  );
}
