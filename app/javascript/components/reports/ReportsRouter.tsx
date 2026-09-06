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
        render={({ match, location }) => (
          <ReportViewer
            type={match.params.type}
            location={location}
          />
        )}
      />
      <Route
        path="/reports/:id"
        render={({ match, location }) => (
          <SavedReportViewer
            id={match.params.id}
            location={location}
          />
        )}
      />
      <Route render={() => <ReportsLandingPage />} />
    </Switch>
  );
}
