import {
  SET_CLUSTERS,
  SET_CLUSTER,
  ADD_CLUSTERS,
  ClusterAction,
  DELETE_CLUSTER
} from "../actions/clusterActions";
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
    case SET_CLUSTERS:
      return state.addAndPrune(action.clusters!);
    case ADD_CLUSTERS:
      return state.add(action.clusters!);
    case SET_CLUSTER:
      return state.add([action.cluster!]);
    case DELETE_CLUSTER:
      return state.remove(action.id!);
  }
  return state;
}
