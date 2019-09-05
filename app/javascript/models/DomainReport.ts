import { Domain } from "./Domain";
import { IEvent, IPeriodStrict } from "./Event";
import { IDomainStatusItem } from "./DomainStatusItem";
import { PartialModel, YearMonth } from "./TypeBucket";
import { ActivityReportItem } from "../components/reports/ActivityReportTable";
import update from "immutability-helper";

export interface DRDataParams {
  domain: Domain;
  period: IPeriodStrict;
  languageIds: number[];
  clusterIds: number[];
}

export interface DRDisplayParams {
  hide?: {
    events?: boolean;
    status?: boolean;
    activities?: boolean;
  };
}

export interface DomainReport {
  type: "Domain";
  id?: number;
  name?: string;
  author?: {
    id: number;
    full_name: string;
  };
  dataParams: DRDataParams;
  displayParams: DRDisplayParams;
  data: {
    events: PartialModel<IEvent>[];
    statusItems: PartialModel<IDomainStatusItem>[];
    activityReportItems: ActivityReportItem[];
  };
}

export function blankDomainReport(viewPrefParams?: DRDataParams): DomainReport {
  const year = new Date().getFullYear();
  return {
    type: "Domain",
    dataParams: viewPrefParams || {
      domain: "Translation",
      period: { start: { year, month: 1 }, end: { year, month: 12 } },
      languageIds: [],
      clusterIds: []
    },
    displayParams: {},
    data: {
      events: [],
      statusItems: [],
      activityReportItems: []
    }
  };
}

export function domainReportParams(report: DomainReport) {
  return update(report, { $unset: ["data"] });
}
