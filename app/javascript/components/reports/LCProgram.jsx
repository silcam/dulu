import React from "react";
import PropTypes from "prop-types";
import BibleBooksTable from "./BibleBooksTable";
import PubsTable from "./PubsTable";
import { Link } from "react-router-dom";

export default function LCProgram(props) {
  const language = props.language;
  const report = props.report;
  const t = props.t;

  return (
    <div>
      <h4>
        <Link to={`/languages/${language.id}`}>{language.name}</Link>
      </h4>
      <BibleBooksTable
        t={t}
        elements={report.elements}
        activities={language.report.activities}
      />
      {showPubsTable(report) && (
        <PubsTable t={t} elements={report.elements} language={language} />
      )}
    </div>
  );
}

function showPubsTable(report) {
  return Object.keys(report.elements.publications).some(
    pub => report.elements.publications[pub]
  );
}

LCProgram.propTypes = {
  t: PropTypes.func.isRequired,
  report: PropTypes.object.isRequired,
  language: PropTypes.object.isRequired
};
