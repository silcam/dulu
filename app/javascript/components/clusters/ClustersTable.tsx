import React from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../shared/Loading";
import style from "../shared/MasterDetail.css";
import { ICluster } from "../../models/Cluster";
import List from "../../models/List";

interface IProps {
  clusters: List<ICluster>;
  id?: number;
}

export default ClustersTable;

function ClustersTable(props: IProps) {
  const navigate = useNavigate();
  const clusters = props.clusters;

  if (clusters.length() == 0) return <Loading />;

  return (
    <div>
      <table>
        <tbody>
          {clusters.map(cluster => (
            <tr
              key={cluster.id}
              className={cluster.id == props.id ? style.selected : undefined}
              onClick={() => navigate(`/clusters/${cluster.id}`)}
            >
              <td>{cluster.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
