import React from "react";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { ICluster } from "../../models/Cluster";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

export interface ClusterContext {
  id: number;
  basePath: string;
  cluster: ICluster;
  loading: boolean;
}

export const useClusterContext = () => useOutletContext<ClusterContext>();

// A layout route rather than a <Switch>: it loads the cluster and hands it to
// whichever child route matched. Its children are declared in MainRouter.
export default function ClusterPageRouter() {
  const id = parseInt(useParams().id!);
  const loading = useLoadOnMount(`/api/clusters/${id}`);
  const cluster = useAppSelector(state => state.clusters.get(id));

  const context: ClusterContext = {
    id,
    basePath: `/clusters/${id}`,
    cluster,
    loading
  };

  return <Outlet context={context} />;
}
