import {
  SET_CLUSTERS,
  SET_CLUSTER,
  ADD_CLUSTERS,
  ClusterAction,
  DELETE_CLUSTER
} from "../actions/clusterActions";
import Cluster, { ICluster } from "../models/Cluster";
import List from "../models/List";

export default function clustersReducer(
  state = new List<ICluster>(Cluster.emptyCluster, [], Cluster.compare),
  action: ClusterAction
) {
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
