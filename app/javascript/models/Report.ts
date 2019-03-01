import { ILanguage } from "./Language";
import { ICluster } from "./Cluster";
import { T } from "../i18n/i18n";

export interface IReport {
  type: string;
  elements: {
    activities: {
      Old_testament?: boolean;
      New_testament?: boolean;
    };
    publications: {
      [pub: string]: boolean;
    };
  };
  languages: ILanguage[];
  clusters: ICluster[];
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
