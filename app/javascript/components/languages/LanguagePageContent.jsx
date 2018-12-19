import React from "react";
import PropTypes from "prop-types";
import styles from "./LanguagePageContent.css";
import ActivitiesTable from "./ActivitiesTable";
import EventsTable from "./EventsTable";
import ParticipantsTable from "./ParticipantsTable";
import TranslationStatus from "./TranslationStatus";
import Event from "../../models/Event";

export default function LanguagePageContent(props) {
  return (
    <div className={styles.pageContent}>
      {(props.tab == "Translation" || props.tab == "Media") && (
        <ActivitiesTable {...props} type={props.tab.toLowerCase()} />
      )}
      {props.tab == "Linguistics" && (
        <div>
          <ActivitiesTable
            {...props}
            type="research"
            heading={props.t("Research_activities")}
          />
          <ActivitiesTable
            {...props}
            type="workshops"
            heading={props.t("Workshops_activities")}
          />
        </div>
      )}
      <EventsTable
        language={props.language}
        t={props.t}
        replaceLanguage={props.replaceLanguage}
        setNetworkError={props.setNetworkError}
        basePath={`/languages/${props.language.id}`}
        history={props.history}
        events={Event.domainEvents(props.language.events, props.tab)}
        domain={props.tab}
      />
      <ParticipantsTable
        t={props.t}
        domain={props.tab}
        participants={props.language.participants}
        language={props.language}
        can={props.language.can}
        setNetworkError={props.setNetworkError}
        replace={props.replaceLanguage}
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
  setNetworkError: PropTypes.func.isRequired,
  replaceLanguage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};
