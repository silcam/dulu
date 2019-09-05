import React, { useContext } from "react";
import LCProgram from "./LCProgram";
import style from "./ReportsViewer.css";
import { Link } from "react-router-dom";
import ColorKey from "./ColorKey";
import { TranslationProgressReport } from "../../models/TranslationProgressReport";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  report: TranslationProgressReport;
}

export default function TranslationProgressReportBody(props: IProps) {
  const report = props.report;
  const t = useContext(I18nContext);
  return (
    <div className={style.lcReport}>
      <div>
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
