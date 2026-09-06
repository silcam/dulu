import React from "react";
import { ILanguage } from "../../models/Language";
import { LanguageBackLink } from "../shared/BreadCrumbs";
import ParticipantView from "./ParticipantView";

interface IProps {
  language: ILanguage;
  basePath: string;
  participantId: number;
}

export default function LanguageParticipantPage(props: IProps) {
  const language = props.language;

  return (
    <div>
      <LanguageBackLink language={language} />

      <ParticipantView {...props} id={props.participantId} />
    </div>
  );
}
