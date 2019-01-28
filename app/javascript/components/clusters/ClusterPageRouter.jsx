import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import ClusterParticipantPage from "./ClusterParticipantPage";
import ClusterPage from "./ClusterPage";

export default function ClusterPageRouter(props) {
  return (
    <Switch>
      <Route
        path="/clusters/:id/participants/:participantId"
        render={({ match, history }) => (
          <ClusterParticipantPage
            participantId={match.params.participantId}
            history={history}
            {...props}
          />
        )}
      />
      <Route
        render={({ history }) => <ClusterPage {...props} history={history} />}
      />
    </Switch>
  );
}
