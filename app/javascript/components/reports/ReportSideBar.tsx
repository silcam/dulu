import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";
import { IReport } from "../../models/Report";
import TranslationProgressReportSidebar from "./TranslationProgressReportSidebar";
import DomainReportSidebar from "./DomainReportSidebar";

interface IProps {
  report: IReport;
  setReport: (r: IReport) => void;
  save: () => void;
  setLoading: (loading: boolean) => void;
}

export default function ReportSideBar(props: IProps) {
  const t = useContext(I18nContext);
  const report = props.report;

  return (
    <div>
      <h3>{t("Report_options")}</h3>
      {showSaveButton(report) && (
        <button onClick={props.save}>{t("Save")}</button>
      )}
      <SidebarBody {...props} />
    </div>
  );
}

function SidebarBody(props: IProps) {
  switch (props.report.type) {
    case "LanguageComparison":
      return <TranslationProgressReportSidebar report={props.report} setReport={props.setReport} setLoading={props.setLoading} />;
    case "Domain":
      return (
        <DomainReportSidebar
          report={props.report}
          setReport={props.setReport}
        />
      );
  }
}

function showSaveButton(report: IReport) {
  switch (report.type) {
    case "LanguageComparison":
      return (
        (report.clusters.length > 0 || report.languages.length > 0) &&
        (Object.keys(report.elements.activities).some(
          testament => !!report.elements.activities[testament]
        ) ||
          Object.keys(report.elements.publications).some(
            pub => report.elements.publications[pub]
          ))
      );
    case "Domain":
    default:
      return true;
  }
}
