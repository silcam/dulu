import React from "react";
import { DomainReport } from "../../models/DomainReport";
import ActivityReportTable from "./ActivityReportTable";
import EventReportTable from "./EventReportTable";
import DomainStatusReportTable from "./DomainStatusReportTable";

interface IProps {
  report: DomainReport;
}

export default function DomainReportBody(props: IProps) {
  const report = props.report;
  return (
    <div>
      {report.data.activityReportItems && (
        <ActivityReportTable report={report} />
      )}
      <EventReportTable events={report.data.events} />
      <DomainStatusReportTable report={report} />
    </div>
  );
}
