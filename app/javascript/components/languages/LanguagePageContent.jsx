import React from "react";
import PropTypes from "prop-types";
import styles from "./LanguagePageContent.css";
import ActivitiesTable from "./ActivitiesTable";
import EventsTable from "./EventsTable";
import PeopleTable from "./PeopleTable";
import TranslationStatus from "./TranslationStatus";

export default function LanguagePageContent(props) {
  return (
    <div className={styles.pageContent}>
      {(props.tab == "Translation" || props.tab == "Media") && (
        <ActivitiesTable {...props} type={props.tab.toLowerCase()} />
      )}
      <EventsTable {...props} />
      <PeopleTable {...props} />
      {props.tab == "Translation" && <TranslationStatus {...props} />}
    </div>
  );
}

LanguagePageContent.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  tab: PropTypes.string.isRequired
};
