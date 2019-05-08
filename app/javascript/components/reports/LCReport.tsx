import React, { useContext } from "react";
import LCProgram from "./LCProgram";
import style from "./ReportsViewer.css";
import { Link } from "react-router-dom";
import ColorKey from "./ColorKey";
import { IReport } from "../../models/Report";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  report: IReport;
}

export default function LCReport(props: IProps) {
  const report = props.report;
  const t = useContext(I18nContext);
  return (
    <div className={style.lcReport}>
      <div>
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
        <ColorKey />
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
                report={report}
              />
            ))}
          </div>
        ))}
        {report.languages.map(language => (
          <LCProgram key={language.id} language={language} report={report} />
        ))}
      </div>
    </div>
  );
}
