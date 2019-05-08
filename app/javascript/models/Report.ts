import { T } from "../i18n/i18n";

export interface IReportElements {
  activities: {
    Old_testament: boolean | undefined;
    New_testament: boolean | undefined;
    [eitherTestament: string]: boolean | undefined; // Odd Typescript problem
  };
  publications: {
    [pub: string]: boolean;
  };
}
export interface IReport {
  id: number;
  name?: string;
  type: "LanguageComparison";
  author?: {
    id: number;
    full_name: string;
  };
  elements: IReportElements;
  clusters: Array<{
    id: number;
    name: string;
    languages: IReportLanguage[];
  }>;
  languages: IReportLanguage[];
}

export interface IReportActivities {
  Old_testament: string[];
  New_testament: string[];
}

export interface IReportLanguage {
  id: number;
  name: string;
  report: {
    activities: IReportActivities;
    publications: {
      [pub: string]: boolean | null;
    };
  };
}

function params(report: IReport) {
  return {
    type: report.type,
    elements: report.elements,
    languages: report.languages.map(p => p.id),
    clusters: report.clusters.map(c => c.id)
  };
}

function copy(report: IReport) {
  return {
    type: report.type,
    elements: report.elements,
    languages: report.languages,
    clusters: report.clusters
  };
}

function tPubName(pubName: string, t: T) {
  if (pubName.startsWith("Audio_"))
    return t("Audio") + " " + t(pubName.slice(6));
  if (pubName.endsWith("Film")) return t(`films.${pubName}`);
  return t(pubName);
}

const LanguageComparison = {
  elements: {
    activities: ["Old_testament", "New_testament"],
    publications: [
      "Bible",
      "New_testament",
      "Old_testament",
      "Audio_Bible",
      "Audio_New_testament",
      "Audio_Old_testament",
      "JesusFilm",
      "LukeFilm",
      "App",
      "Dictionary",
      "Any_literacy"
    ]
  }
};

export default {
  LanguageComparison,
  params,
  copy,
  tPubName
};
