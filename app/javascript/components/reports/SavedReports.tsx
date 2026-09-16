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

  // The `if (!savedReports)` guard this used to carry could never be false: the
  // effect runs once, on mount, and savedReports is null until this very request
  // answers. Dropping the dead read is what makes the empty dependency list honest
  // -- nothing is omitted from it any more -- instead of something to suppress.
  useEffect(() => {
    DuluAxios.get("/api/reports").then(
      data => data && setSavedReports(data.reports)
    );
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
