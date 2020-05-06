import React, { useContext } from "react";
import LanguageEventsContainer from "./LanguageEventsContainer";
import { DSICategory } from "../../models/DomainStatusItem";
import { ILanguage } from "../../models/Language";
import { LanguagePageTab } from "./LanguagePage";
import { Location, History } from "history";
import I18nContext from "../../contexts/I18nContext";
import TranslationProgress from "./TranslationProgress";
import DomainStatus from "./DomainStatus";
import ActivitiesTable from "./ActivitiesTable";
import ParticipantsTable from "./ParticipantsTable";

interface IProps {
  language: ILanguage;
  tab: LanguagePageTab;
  location: Location;

  history: History;
}

export default function LanguagePageContent(props: IProps) {
  if (props.tab == "Events") {
    return (
      <LanguageEventsContainer
        {...props}
        basePath={`/languages/${props.language.id}`}
      />
    );
  }
  if (props.tab == "People") {
    return (
      <ParticipantsTable
        {...props}
        can={props.language.can}
        basePath={`/languages/${props.language.id}`}
      />
    );
  }

  const t = useContext(I18nContext);

  return (
    <div className={`padBottom`}>
      {props.tab == "Translation" && (
        <TranslationProgress language={props.language} />
      )}

      {(props.tab == "Translation" || props.tab == "Media") && (
        <ActivitiesTable
          {...props}
          type={props.tab}
          basePath={`/languages/${props.language.id}`}
        />
      )}
      {props.tab == "Linguistics" && (
        <div>
          <ActivitiesTable
            {...props}
            type="Research"
            heading={t("Research_activities")}
            basePath={`/languages/${props.language.id}`}
          />
          <ActivitiesTable
            {...props}
            type="Workshops"
            heading={t("Workshops_activities")}
            basePath={`/languages/${props.language.id}`}
          />
        </div>
      )}

      <LanguageEventsContainer
        language={props.language}
        basePath={`/languages/${props.language.id}`}
        history={props.history}
        domain={props.tab}
      />
      <ParticipantsTable
        domain={props.tab}
        language={props.language}
        can={props.language.can}
        basePath={`/languages/${props.language.id}`}
        history={props.history}
      />

      <DomainStatus {...props} categories={categoriesByDomain(props.tab)} />
    </div>
  );
}

function categoriesByDomain(domain: string): DSICategory[] {
  switch (domain) {
    case "Translation":
      return ["PublishedScripture", "ScriptureApp", "AudioScripture", "Film"];
    case "Media":
      return ["AudioScripture", "Film", "ScriptureApp"];
    case "Linguistics":
      return ["DataCollection", "Research" /*"Community"*/];
    case "Literacy":
      return ["LiteracyMaterial"];
    default:
      return [];
  }
}
