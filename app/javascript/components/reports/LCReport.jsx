import React from "react";
import PropTypes from "prop-types";
import LCProgram from "./LCProgram";

export default function LCReport(props) {
  const report = props.report;
  const t = props.t;
  return (
    <div>
      <h2>{report.name ? report.name : t("LanguageComparison")}</h2>
      {report.author && (
        <h5>
          {t("Created_by", { name: report.author.full_name })}
          <br />
          {t("Share_this_report", {
            url: `https://dulu.sil.org/reports/${report.id}`
          })}
        </h5>
      )}
      <div>
        {report.clusters.map(cluster => (
          <div key={cluster.id}>
            <h3>{cluster.name}</h3>
            {cluster.programs.map(program => (
              <LCProgram
                key={program.id}
                program={program}
                t={t}
                report={report}
              />
            ))}
          </div>
        ))}
        {report.programs.map(program => (
          <LCProgram key={program.id} program={program} t={t} report={report} />
        ))}
      </div>
    </div>
  );
}

LCReport.propTypes = {
  t: PropTypes.func.isRequired,
  report: PropTypes.object.isRequired
};
