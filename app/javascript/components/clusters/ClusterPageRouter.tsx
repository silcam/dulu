import React from "react";
import { Switch, Route } from "react-router-dom";
import ClusterParticipantPage from "./ClusterParticipantPage";
import ClusterPage from "./ClusterPage";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  id: number;
  basePath: string;
}

export default function ClusterPageRouter(props: IProps) {
  const loading = useLoadOnMount(`/api/clusters/${props.id}`);
  const cluster = useAppSelector(state => state.clusters.get(props.id));

  return (
    <Switch>
      <Route
        path="/clusters/:id/participants/:participantId"
        render={({ match, history }) => (
          <ClusterParticipantPage
            participantId={parseInt(match.params.participantId)}
            history={history}
            cluster={cluster}
            {...props}
          />
        )}
      />
      <Route
        render={({ history }) => (
          <ClusterPage {...props} history={history} loading={loading} />
        )}
      />
    </Switch>
  );
}
