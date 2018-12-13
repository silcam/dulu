import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Loading from "../shared/Loading";
import style from "../shared/MasterDetail.css";

export default withRouter(ClustersTable);

function ClustersTable(props) {
  const clusters = props.clusters;
  const t = props.t;

  if (clusters.length == 0) return <Loading t={t} />;

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

ClustersTable.propTypes = {
  clusters: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  id: PropTypes.string,
  history: PropTypes.object.isRequired // Supplied by withRouter
};
