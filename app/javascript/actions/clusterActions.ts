import { ICluster } from "../models/Cluster";

export const ADD_CLUSTERS = "ADD_CLUSTERS";

export interface ClusterAction {
  type: string;
  clusters?: ICluster[];
  cluster?: ICluster;
  id?: number;
}

export function addClusters(clusters: ICluster[]) {
  return {
    type: ADD_CLUSTERS,
    clusters
  };
}
