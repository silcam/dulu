import { ADD_CLUSTERS, ClusterAction } from "../actions/clusterActions";
import Cluster from "../models/Cluster";
import { isLoadAction } from "./LoadAction";

export default function clustersReducer(
  state = Cluster.emptyList(),
  action: ClusterAction
) {
  if (isLoadAction(action)) {
    return state
      .add(action.payload.clusters)
      .remove(action.payload.deletedClusters);
  }
  switch (action.type) {
    case ADD_CLUSTERS:
      return state.add(action.clusters!);
  }
  return state;
}
