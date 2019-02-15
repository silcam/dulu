import { BasicModel } from "../models/BasicModel";

export const SET_CLUSTERS = "SET_CLUSTERS";
export const SET_CLUSTER = "SET_CLUSTER";
export const ADD_CLUSTERS = "ADD_CLUSTERS";

export interface ClusterAction {
  type: string;
  clusters?: BasicModel[];
  cluster?: BasicModel;
}

export function setClusters(clusters: BasicModel[]) {
  return {
    type: SET_CLUSTERS,
    clusters: clusters
  };
}

export function setCluster(cluster: BasicModel) {
  return {
    type: SET_CLUSTER,
    cluster: cluster
  };
}

export function addClusters(clusters: BasicModel[]) {
  return {
    type: ADD_CLUSTERS,
    clusters: clusters
  };
}
