import React from "react";
import { Selection } from "../components/dashboard/Dashboard";
import { DRDataParams } from "../models/DomainReport";

export interface ViewPrefs {
  dashboardSelection?: Selection;
  dashboardTab?: string;
  notificationsTab?: number;
  domainReportParams?: DRDataParams;
}

export interface UpdateViewPrefs {
  (mergeViewPrefs: ViewPrefs): void;
}

interface IViewPrefsContext {
  viewPrefs: ViewPrefs;
  updateViewPrefs: UpdateViewPrefs;
}

const ViewPrefsContext = React.createContext<IViewPrefsContext>({
  viewPrefs: {},
  updateViewPrefs: (_mergePrefs: ViewPrefs) => {}
});

export default ViewPrefsContext;
