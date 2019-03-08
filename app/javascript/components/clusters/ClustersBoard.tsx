import React from "react";
import ClustersTable from "./ClustersTable";
import style from "../shared/MasterDetail.css";
import ClusterPageRouter from "./ClusterPageRouter";
import FlexSpacer from "../shared/FlexSpacer";
import { Link } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import NewClusterForm from "./NewClusterForm";
import { T } from "../../i18n/i18n";
import DuluAxios from "../../util/DuluAxios";
import { ICluster } from "../../models/Cluster";
import { History, Location } from "history";
import { Adder, Setter, SetCan } from "../../models/TypeBucket";
import { ICan } from "../../actions/canActions";

interface IProps {
  t: T;
  id?: number;
  action: string;
  basePath: string;
  history: History;
  location: Location;
  clusters: ICluster[];
  setClusters: Adder<ICluster>;
  setCluster: Setter<ICluster>;
  setCan: SetCan;
  can: ICan;
}

export default class ClustersBoard extends React.Component<IProps> {
  async componentDidMount() {
    const data = await DuluAxios.get("/api/clusters");
    if (data) {
      this.props.setCan("clusters", data.can);
      this.props.setClusters(data.clusters);
    }
  }

  render() {
    const t = this.props.t;

    return (
      <div className={style.container}>
        <div className={style.headerBar}>
          <h2>
            <Link to="/clusters">{t("Clusters")}</Link>
          </h2>
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
            <ClustersTable id={this.props.id} clusters={this.props.clusters} />
          </div>
          <div className={style.detail}>
            {this.props.action == "new" && (
              <NewClusterForm
                t={t}
                setCluster={this.props.setCluster}
                history={this.props.history}
              />
            )}
            {!!this.props.id && (
              <ClusterPageRouter
                key={this.props.id}
                id={this.props.id}
                t={t}
                basePath={this.props.basePath}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
