import {
  TranslationProgressReport,
  blankTranslationProgressReport,
  translationProgressReportParams
} from "./TranslationProgressReport";
import {
  DomainReport,
  blankDomainReport,
  DRDataParams,
  domainReportParams
} from "./DomainReport";
import update from "immutability-helper";

export const ReportTypes = <const>["LanguageComparison", "Domain"];
export type ReportType = typeof ReportTypes[number];

export type IReport = TranslationProgressReport | DomainReport;

// export function copyReport(report: IReport) {
//   return update(report, { $merge: { id: 0 } });
// }

export function blankReport(type: ReportType, viewPrefParams?: DRDataParams) {
  switch (type) {
    case "LanguageComparison":
      return blankTranslationProgressReport();
    case "Domain":
    default:
      return blankDomainReport(viewPrefParams);
  }
}

export function reportParams(report: IReport) {
  switch (report.type) {
    case "LanguageComparison":
      return translationProgressReportParams(report);
    case "Domain":
      return domainReportParams(report);
  }
}
