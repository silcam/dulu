import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import DuluAxios from "../../util/DuluAxios";
import I18nContext from "../../contexts/I18nContext";
import Loading from "../shared/Loading";

export interface ISavedReport {
  id: number;
  name: string;
}

export default function SavedReports() {
  const [expanded, setExpanded] = useState(false);
  const [savedReports, setSavedReports] = useState<ISavedReport[] | null>(null);
  const t = useContext(I18nContext);

  useEffect(() => {
    if (!savedReports) {
      DuluAxios.get("/api/reports").then(
        data => data && setSavedReports(data.reports)
      );
    }
  }, []);

  return (
    <div>
      <h2>{t("Saved_reports")}</h2>

      {savedReports ? (
        <div>
          <ul>
            {(expanded ? savedReports : savedReports.slice(0, 5)).map(
              report => (
                <li key={report.id}>
                  <h4>
                    <Link to={`/reports/${report.id}`}>{report.name}</Link>
                  </h4>
                </li>
              )
            )}
          </ul>
          {!expanded && savedReports.length > 5 && (
            <button className="link" onClick={() => setExpanded(true)}>
              {t("See_all")}
            </button>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
