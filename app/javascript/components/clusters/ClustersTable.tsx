import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Loading from "../shared/Loading";
import style from "../shared/MasterDetail.css";
import { ICluster } from "../../models/Cluster";

interface IProps extends RouteComponentProps<any> {
  clusters: ICluster[];
  id?: number;
}

export default withRouter(ClustersTable);

function ClustersTable(props: IProps) {
  const clusters = props.clusters;

  if (clusters.length == 0) return <Loading />;

  return (
    <div>
      <table>
        <tbody>
          {clusters.map(cluster => (
            <tr
              key={cluster.id}
              className={cluster.id == props.id ? style.selected : undefined}
              onClick={() => props.history.push(`/clusters/${cluster.id}`)}
            >
              <td>{cluster.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
