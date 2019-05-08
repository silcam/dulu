import React from "react";
import BibleBooksTable from "./BibleBooksTable";
import PubsTable from "./PubsTable";
import { Link } from "react-router-dom";
import { IReport, IReportLanguage } from "../../models/Report";

interface IProps {
  report: IReport;
  language: IReportLanguage;
}

export default function LCProgram(props: IProps) {
  const language = props.language;
  const report = props.report;

  return (
    <div>
      <h4>
        <Link to={`/languages/${language.id}`}>{language.name}</Link>
      </h4>
      <BibleBooksTable
        elements={report.elements}
        activities={language.report.activities}
      />
      {showPubsTable(report) && (
        <PubsTable elements={report.elements} language={language} />
      )}
    </div>
  );
}

function showPubsTable(report: IReport) {
  return Object.keys(report.elements.publications).some(
    pub => report.elements.publications[pub]
  );
}
