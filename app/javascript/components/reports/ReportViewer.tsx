import React, { useState } from "react";
import style from "./ReportsViewer.css";
import ReportSideBar from "./ReportSideBar";
import Loading from "../shared/Loading";
import { History, Location } from "history";
import { ReportType, blankReport } from "../../models/Report";
import SaveReportBar from "./SaveReportBar";
import ReportBody from "./ReportBody";
import useViewPrefs from "../../reducers/useViewPrefs";

interface IProps {
  type: ReportType;
  history: History;
  location: Location;
}

export default function ReportViewer(props: IProps) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const { viewPrefs } = useViewPrefs();
  const baseReport =
    props.location.state && props.location.state.report
      ? props.location.state.report
      : blankReport(props.type, viewPrefs.domainReportParams);
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
