export default class Report {
  static params(report) {
    return {
      type: report.type,
      elements: report.elements,
      languages: report.languages.map(p => p.id),
      clusters: report.clusters.map(c => c.id)
    };
  }

  static copy(report) {
    return {
      type: report.type,
      elements: report.elements,
      languages: report.languages,
      clusters: report.clusters
    };
  }

  static tPubName(pubName, t) {
    if (pubName.startsWith("Audio_"))
      return t("Audio") + " " + t(pubName.slice(6));
    if (pubName.endsWith("Film")) return t(`films.${pubName}`);
    return t(pubName);
  }
}

Report.LanguageComparison = {
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
