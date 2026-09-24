import React from "react";
import { LanguageBackLink } from "../shared/BreadCrumbs";
import ParticipantView from "./ParticipantView";
import { useLanguageContext } from "./LanguagePageRouter";
import { useParams } from "react-router-dom";

export default function LanguageParticipantPage() {
  const { language, basePath } = useLanguageContext();
  const participantId = parseInt(useParams().participantId!);

  return (
    <div>
      <LanguageBackLink language={language} />

      <ParticipantView basePath={basePath} id={participantId} />
    </div>
  );
}
