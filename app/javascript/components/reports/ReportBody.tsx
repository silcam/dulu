import React from "react";
import { IReport } from "../../models/Report";
import TranslationProgressReportBody from "./TranslationProgressReportBody";
import DomainReportBody from "./DomainReportBody";

interface IProps {
  report: IReport;
}

export default function ReportBody(props: IProps) {
  switch (props.report.type) {
    case "LanguageComparison":
      return <TranslationProgressReportBody report={props.report} />;
    case "Domain":
      return <DomainReportBody report={props.report} />;
  }
}
