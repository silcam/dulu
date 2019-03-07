import React from "react";
import PropTypes from "prop-types";
import styles from "./LanguagePageContent.css";
import ActivitiesContainer from "./ActivitiesContainer";
import ParticipantsContainer from "./ParticipantsContainer";
import LanguageEventsContainer from "./LanguageEventsContainer";
import DomainStatusContainer from "./DomainStatusContainer";
import { DSICategories } from "../../models/DomainStatusItem";

export default function LanguagePageContent(props) {
  if (props.tab == "Events") {
    return (
      <LanguageEventsContainer
        {...props}
        basePath={`/languages/${props.language.id}`}
        superEventsTable
      />
    );
  }
  if (props.tab == "People") {
    return (
      <ParticipantsContainer
        {...props}
        can={props.language.can}
        basePath={`/languages/${props.language.id}`}
      />
    );
  }

  return (
    <div className={`padBottom ${styles.pageContent}`}>
      {(props.tab == "Translation" || props.tab == "Media") && (
        <ActivitiesContainer
          {...props}
          type={props.tab}
          basePath={`/languages/${props.language.id}`}
        />
      )}
      {props.tab == "Linguistics" && (
        <div>
          <ActivitiesContainer
            {...props}
            type="Research"
            heading={props.t("Research_activities")}
            basePath={`/languages/${props.language.id}`}
          />
          <ActivitiesContainer
            {...props}
            type="Workshops"
            heading={props.t("Workshops_activities")}
            basePath={`/languages/${props.language.id}`}
          />
        </div>
      )}

      <LanguageEventsContainer
        language={props.language}
        t={props.t}
        basePath={`/languages/${props.language.id}`}
        history={props.history}
        domain={props.tab}
      />
      <ParticipantsContainer
        t={props.t}
        domain={props.tab}
        language={props.language}
        can={props.language.can}
        basePath={`/languages/${props.language.id}`}
        history={props.history}
      />

      <DomainStatusContainer
        {...props}
        categories={categoriesByDomain(props.tab)}
      />
    </div>
  );
}

function categoriesByDomain(domain) {
  switch (domain) {
    case "Translation":
      return [
        DSICategories.PublishedScripture,
        DSICategories.ScriptureApp,
        DSICategories.AudioScripture,
        DSICategories.Film
      ];
    case "Media":
      return [
        DSICategories.AudioScripture,
        DSICategories.Film,
        DSICategories.ScriptureApp
      ];
    default:
      return [];
  }
}

LanguagePageContent.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  tab: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,

  history: PropTypes.object.isRequired
};
