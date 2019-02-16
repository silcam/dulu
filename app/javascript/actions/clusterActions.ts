import { ICluster } from "../models/Cluster";

export const SET_CLUSTERS = "SET_CLUSTERS";
export const SET_CLUSTER = "SET_CLUSTER";
export const ADD_CLUSTERS = "ADD_CLUSTERS";
export const DELETE_CLUSTER = "DELETE_CLUSTER";

export interface ClusterAction {
  type: string;
  clusters?: ICluster[];
  cluster?: ICluster;
  id?: number;
}

export function setClusters(clusters: ICluster[]) {
  return {
    type: SET_CLUSTERS,
    clusters
  };
}

export function setCluster(cluster: ICluster) {
  return {
    type: SET_CLUSTER,
    cluster
  };
}

export function addClusters(clusters: ICluster[]) {
  return {
    type: ADD_CLUSTERS,
    clusters
  };
}

export function deleteCluster(id: number): ClusterAction {
  return {
    type: DELETE_CLUSTER,
    id
  };
}
