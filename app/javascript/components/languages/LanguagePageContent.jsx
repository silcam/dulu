import React from "react";
import PropTypes from "prop-types";
import styles from "./LanguagePageContent.css";
import TranslationStatus from "./TranslationStatus";
import ActivitiesContainer from "./ActivitiesContainer";
import ParticipantsContainer from "./ParticipantsContainer";
import LanguageEventsContainer from "./LanguageEventsContainer";

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
    <div className={styles.pageContent}>
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

      {props.tab == "Translation" && <TranslationStatus {...props} />}
    </div>
  );
}

LanguagePageContent.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  tab: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  
  history: PropTypes.object.isRequired
};
