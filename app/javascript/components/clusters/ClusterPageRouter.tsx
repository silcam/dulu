import React from "react";
import { Switch, Route } from "react-router-dom";
import ClusterParticipantPageContainer from "./ClusterParticipantPageContainer";
import ClusterContainer from "./ClusterContainer";

export default function ClusterPageRouter(props: any) {
  return (
    <Switch>
      <Route
        path="/clusters/:id/participants/:participantId"
        render={({ match, history }) => (
          <ClusterParticipantPageContainer
            participantId={parseInt(match.params.participantId)}
            history={history}
            {...props}
          />
        )}
      />
      <Route
        render={({ history }) => (
          <ClusterContainer {...props} history={history} />
        )}
      />
    </Switch>
  );
}
