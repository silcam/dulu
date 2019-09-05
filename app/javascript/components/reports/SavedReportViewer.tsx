import React, { useState, useEffect, useContext } from "react";
import { History, Location } from "history";
import DuluAxios from "../../util/DuluAxios";
import { IReport } from "../../models/Report";
import Loading from "../shared/Loading";
import EditActionBar from "../shared/EditActionBar";
import ReportBody from "./ReportBody";
import style from "./ReportsViewer.css";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  id: number;
  history: History;
  location: Location;
}
export default function SavedReportViewer(props: IProps) {
  const t = useContext(I18nContext);
  const [report, setReport] = useState<IReport | null>(null);
  useEffect(() => {
    DuluAxios.get(`/api/reports/${props.id}`).then(data => {
      if (data) setReport(data.report);
    });
  }, [props.id]);

  if (!report) return <Loading />;

  return (
    <div style={{ margin: "0 24px", paddingBottom: "60px" }}>
      <EditActionBar
        can={{ update: true }}
        edit={() =>
          props.history.push(`/reports/new/${report.type}`, {
            report
          })
        }
      />
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
      <ReportBody report={report} />
    </div>
  );
}
