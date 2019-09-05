import React, { useState } from "react";
import { Switch, Route } from "react-router";
import { ReportType } from "../../models/Report";
import ReportsLandingPage from "./ReportsLandingPage";
import ReportViewer from "./ReportViewer";
import SavedReportViewer from "./SavedReportViewer";

export default function ReportsRouter() {
  const [] = useState<ReportType | null>(null);

  return (
    <Switch>
      <Route
        path="/reports/new/:type"
        render={({ match, history, location }) => (
          <ReportViewer
            type={match.params.type}
            history={history}
            location={location}
          />
        )}
      />
      <Route
        path="/reports/:id"
        render={({ match, history, location }) => (
          <SavedReportViewer
            id={match.params.id}
            history={history}
            location={location}
          />
        )}
      />
      <Route render={() => <ReportsLandingPage />} />
    </Switch>
  );
}
