import React from "react";
import PropTypes from "prop-types";
import thingBoard from "../shared/thingBoard";
import Cluster from "../../models/Cluster";
import ClustersTable from "./ClustersTable";
import style from "../shared/MasterDetail.css";

class _ClustersBoard extends React.PureComponent {
  state = {};

  render() {
    const t = this.props.t;

    return (
      <div className={style.container}>
        <div className={style.headerBar}>
          <h2>{t("Clusters")}</h2>
        </div>
        <div className={style.masterDetailContainer}>
          <div className={style.master}>
            <ClustersTable
              t={t}
              id={this.props.id}
              clusters={this.props.clusters}
              can={this.props.can}
            />
          </div>
        </div>
      </div>
    );
  }
}

const ClustersBoard = thingBoard(_ClustersBoard, {
  name: "cluster",
  compare: Cluster.compare
});

export default ClustersBoard;

_ClustersBoard.propTypes = {
  t: PropTypes.func.isRequired,
  id: PropTypes.string,

  // Supplied by thingBoard
  clusters: PropTypes.array,
  can: PropTypes.object
};
