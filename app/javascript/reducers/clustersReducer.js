import {
  SET_CLUSTERS,
  SET_CLUSTER,
  ADD_CLUSTERS
} from "../actions/clusterActions";
import { setList, setItem, addItems } from "./reducerUtil";
import Cluster from "../models/Cluster";

const emptyState = {
  list: [],
  byId: {}
};

export default function clustersReducer(state = emptyState, action) {
  switch (action.type) {
    case SET_CLUSTERS:
      return setList(state, action.clusters);
    case ADD_CLUSTERS:
      return addItems(state, action.clusters, Cluster.compare);
    case SET_CLUSTER:
      return setItem(state, action.cluster, Cluster.compare);
  }
  return state;
}
