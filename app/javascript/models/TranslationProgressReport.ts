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
export interface TranslationProgressReport {
  type: "LanguageComparison";
  id?: number;
  name?: string;
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

export function translationProgressReportParams(
  report: TranslationProgressReport
) {
  return {
    type: report.type,
    elements: report.elements,
    languages: report.languages.map(p => p.id),
    clusters: report.clusters.map(c => c.id)
  };
}

function tPubName(pubName: string, t: T) {
  if (pubName.startsWith("Audio_"))
    return t("Audio") + " " + t(pubName.slice(6));
  if (pubName.endsWith("Film")) return t(pubName);
  return t(pubName);
}

const LanguageComparison = {
  elements: {
    activities: ["Old_testament", "New_testament"],
    publications: [
      "Bible",
      "New_testament",
      "Portions",
      "Audio_Bible",
      "Audio_New_testament",
      "JesusFilm",
      "LukeFilm",
      "App"
    ]
  }
};

export function blankTranslationProgressReport(): TranslationProgressReport {
  return {
    type: "LanguageComparison",
    elements: {
      activities: {
        Old_testament: true,
        New_testament: true
      },
      publications: {}
    },
    clusters: [],
    languages: []
  };
}

export default {
  LanguageComparison,
  tPubName
};
