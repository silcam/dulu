import {
  SET_CLUSTERS,
  SET_CLUSTER,
  ADD_CLUSTERS,
  ClusterAction,
  DELETE_CLUSTER
} from "../actions/clusterActions";
import Cluster, { ICluster } from "../models/Cluster";
import { stdReducers, State } from "./stdReducers";

export type ClusterState = State<ICluster>;

const emptyState: ClusterState = {
  list: [],
  byId: {},
  listSet: false
};

const stdClusterReducers = stdReducers<ICluster>(
  Cluster.emptyCluster,
  Cluster.compare
);

export default function clustersReducer(
  state = emptyState,
  action: ClusterAction
): ClusterState {
  switch (action.type) {
    case SET_CLUSTERS:
      return stdClusterReducers.setList(state, action.clusters as ICluster[]);
    case ADD_CLUSTERS:
      return stdClusterReducers.addItems(state, action.clusters as ICluster[]);
    case SET_CLUSTER:
      return stdClusterReducers.addItems(state, [action.cluster as ICluster]);
    case DELETE_CLUSTER:
      return stdClusterReducers.deleteItem(state, action.id!);
  }
  return state;
}
