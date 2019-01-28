import React from "react";
import PropTypes from "prop-types";
import thingBoard from "../shared/thingBoard";
import Cluster from "../../models/Cluster";
import ClustersTable from "./ClustersTable";
import style from "../shared/MasterDetail.css";
import ClusterPageRouter from "./ClusterPageRouter";
import FlexSpacer from "../shared/FlexSpacer";
import { Link } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import NewClusterForm from "./NewClusterForm";

class _ClustersBoard extends React.PureComponent {
  state = {};

  render() {
    const t = this.props.t;
    const selectedCluster = this.props.selected;

    return (
      <div className={style.container}>
        <div className={style.headerBar}>
          <h2>{t("Clusters")}</h2>
          {this.props.can.create && (
            <Link to="/clusters/new">
              <AddIcon iconSize="large" />
            </Link>
          )}
          <FlexSpacer />
          <h3>
            <Link to="/regions">{t("Regions")}</Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to={"/languages"}>{t("Languages")}</Link>
          </h3>
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
          <div className={style.detail}>
            {this.props.action == "new" && (
              <NewClusterForm
                t={t}
                saving={this.props.savingNow}
                addCluster={this.props.add}
              />
            )}
            {selectedCluster && selectedCluster.loaded && (
              <ClusterPageRouter
                key={selectedCluster.id}
                cluster={selectedCluster}
                t={t}
                replaceCluster={this.props.replace}
                setNetworkError={this.props.setNetworkError}
                basePath={this.props.basePath}
                deleteCluster={this.props.delete}
              />
            )}
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
  setNetworkError: PropTypes.func.isRequired,
  basePath: PropTypes.string.isRequired,

  // Supplied by thingBoard
  clusters: PropTypes.array,
  can: PropTypes.object,
  selected: PropTypes.object,
  replace: PropTypes.func,
  delete: PropTypes.func.isRequired,
  savingNow: PropTypes.bool,
  action: PropTypes.string,
  add: PropTypes.func.isRequired
};
