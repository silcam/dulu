import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import DuluAxios from "../../util/DuluAxios";
import style from "./ReportsViewer.css";
import I18nContext from "../../contexts/I18nContext";

export interface ISavedReport {
  id: number;
  name: string;
}

interface IProps {
  savedReports?: ISavedReport[];
  setSavedReports: (reports: ISavedReport[]) => void;
}

export default function SavedReports(props: IProps) {
  const [expanded, setExpanded] = useState(false);
  const t = useContext(I18nContext);

  useEffect(() => {
    if (!props.savedReports) {
      DuluAxios.get("/api/reports").then(
        data => data && props.setSavedReports(data.reports)
      );
    }
  }, []);

  if (!props.savedReports || props.savedReports.length == 0) return null;

  const reports = expanded
    ? props.savedReports
    : props.savedReports.slice(0, 5);
  return (
    <div>
      <h2>{t("Saved_reports")}</h2>
      <div className={style.savedReportsList}>
        <ul>
          {reports.map(report => (
            <li key={report.id}>
              <h4>
                <Link to={`/reports/${report.id}`}>{report.name}</Link>
              </h4>
            </li>
          ))}
        </ul>
        {!expanded && props.savedReports.length > 5 && (
          <button className="link" onClick={() => setExpanded(true)}>
            {t("See_all")}
          </button>
        )}
      </div>
    </div>
  );
}
