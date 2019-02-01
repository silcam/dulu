import React from "react";
import PropTypes from "prop-types";
import LCProgram from "./LCProgram";
import style from "./ReportsViewer.css";
import { Link } from "react-router-dom";
import ColorKey from "./ColorKey";

export default function LCReport(props) {
  const report = props.report;
  const t = props.t;
  return (
    <div className={style.lcReport}>
      <div className={style.lcHeader}>
        <h2>{report.name ? report.name : t("LanguageComparison")}</h2>
        {report.author && (
          <h5 className={style.lcReportSubheader}>
            {t("Created_by", { name: report.author.full_name })}
            <br />
            {t("Share_this_report", {
              url: `https://dulu.sil.org/reports/${report.id}`
            })}
          </h5>
        )}
        <ColorKey t={t} />
      </div>
      <div className={style.lcBody}>
        {report.clusters.map(cluster => (
          <div key={cluster.id}>
            <h3>
              <Link to={`/clusters/${cluster.id}`}>{cluster.name}</Link>
            </h3>
            {cluster.languages.map(language => (
              <LCProgram
                key={language.id}
                language={language}
                t={t}
                report={report}
              />
            ))}
          </div>
        ))}
        {report.languages.map(language => (
          <LCProgram key={language.id} language={language} t={t} report={report} />
        ))}
      </div>
    </div>
  );
}

LCReport.propTypes = {
  t: PropTypes.func.isRequired,
  report: PropTypes.object.isRequired
};
