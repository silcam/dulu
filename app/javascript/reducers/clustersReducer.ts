import {
  SET_CLUSTERS,
  SET_CLUSTER,
  ADD_CLUSTERS,
  ClusterAction,
  DELETE_CLUSTER
} from "../actions/clusterActions";
import Cluster, { ICluster } from "../models/Cluster";
import { stdReducers } from "./stdReducers";
import { IParticipant } from "../models/TypeBucket";
import { LanguageState } from "./languagesReducer";
import { RegionState } from "./regionsReducer";

export interface ClusterState {
  list: number[];
  byId: { [id: string]: ICluster | undefined };
}

export interface AppState {
  clusters: ClusterState;
  languages: LanguageState;
  regions: RegionState;
  participants: { [id: string]: IParticipant };
  [otherState: string]: any;
}

const emptyState: ClusterState = {
  list: [],
  byId: {}
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
      return stdClusterReducers.setList(action.clusters as ICluster[]);
    case ADD_CLUSTERS:
      return stdClusterReducers.addItems(state, action.clusters as ICluster[]);
    case SET_CLUSTER:
      return stdClusterReducers.addItems(state, [action.cluster as ICluster]);
    case DELETE_CLUSTER:
      return stdClusterReducers.deleteItem(state, action.id!);
  }
  return state;
}
