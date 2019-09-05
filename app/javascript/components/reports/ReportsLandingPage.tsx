import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";
import { ReportTypes } from "../../models/Report";
import { Link } from "react-router-dom";
import SavedReports from "./SavedReports";

export default function ReportsLandingPage() {
  const t = useContext(I18nContext);
  return (
    <div style={{ display: "flex", margin: "auto" }}>
      <div style={{ marginRight: "80px" }}>
        <h2>{t("NewReport")}</h2>
        <ul>
          {ReportTypes.map(type => (
            <li key={type}>
              <h4>
                <Link to={`/reports/new/${type}`}>{t(type)}</Link>
              </h4>
            </li>
          ))}
        </ul>
      </div>
      <SavedReports />
    </div>
  );
}
