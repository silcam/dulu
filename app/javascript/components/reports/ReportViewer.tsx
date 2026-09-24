import React, { useState } from "react";
import style from "./ReportsViewer.css";
import ReportSideBar from "./ReportSideBar";
import Loading from "../shared/Loading";
import { useLocation, useParams } from "react-router-dom";
import { IReport, ReportType, blankReport } from "../../models/Report";
import SaveReportBar from "./SaveReportBar";
import ReportBody from "./ReportBody";
import useViewPrefs from "../../reducers/useViewPrefs";

export default function ReportViewer() {
  const type = useParams().type as ReportType;
  const location = useLocation();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const { viewPrefs } = useViewPrefs();
  // SavedReportViewer hands the report over as navigate()'s `state` option.
  const state = location.state as { report?: IReport } | null;
  const baseReport = state && state.report
    ? state.report
    : blankReport(type, viewPrefs.domainReportParams);
  const [report, setReport] = useState(baseReport);

  return (
    <div className={style.container}>
      <div className={style.sidebar}>
        {!saving && (
          <ReportSideBar
            report={report}
            setReport={setReport}
            save={() => setSaving(true)}
            setLoading={setLoading}
          />
        )}
      </div>
      <div className={style.main}>
        {saving && (
          <SaveReportBar report={report} cancel={() => setSaving(false)} />
        )}
        {loading && <Loading />}
        <ReportBody report={report} />
      </div>
    </div>
  );
}
