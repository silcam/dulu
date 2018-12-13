export default class Report {
  static params(report) {
    return {
      type: report.type,
      elements: report.elements,
      programs: report.programs.map(p => p.id),
      clusters: report.clusters.map(c => c.id)
    };
  }

  static copy(report) {
    return {
      type: report.type,
      elements: report.elements,
      programs: report.programs,
      clusters: report.clusters
    };
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
