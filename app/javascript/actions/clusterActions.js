export const SET_CLUSTERS = "SET_CLUSTERS";
export const SET_CLUSTER = "SET_CLUSTER";
export const ADD_CLUSTERS = "ADD_CLUSTERS";

export function setClusters(clusters) {
  return {
    type: SET_CLUSTERS,
    clusters: clusters
  };
}

export function setCluster(cluster) {
  return {
    type: SET_CLUSTER,
    cluster: cluster
  };
}

export function addClusters(clusters) {
  return {
    type: ADD_CLUSTERS,
    clusters: clusters
  };
}
