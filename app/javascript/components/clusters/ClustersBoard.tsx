import React from "react";
import ClustersTable from "./ClustersTable";
import style from "../shared/MasterDetail.css";
import ClusterPageRouter from "./ClusterPageRouter";
import FlexSpacer from "../shared/FlexSpacer";
import { Link } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import NewClusterForm from "./NewClusterForm";
import { History, Location } from "history";
import GoBar from "../shared/GoBar";
import useTranslation from "../../i18n/useTranslation";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  id?: number;
  action: string;
  basePath: string;
  history: History;
  location: Location;
}

export default function ClustersBoard(props: Omit<IProps, "t">) {
  const t = useTranslation();

  const clusters = useAppSelector(state => state.clusters);
  const can = useAppSelector(state => state.can.clusters);

  useLoadOnMount("/api/clusters");

  return (
    <div className={style.container}>
      <div className={style.headerBar}>
        <h2>
          <Link to="/clusters">{t("Clusters")}</Link>
        </h2>
        {can.create && (
          <Link to="/clusters/new">
            <AddIcon iconSize="large" />
          </Link>
        )}
        <GoBar />
        <FlexSpacer />
        <h3>
          <Link to="/regions">{t("Regions")}</Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to={"/languages"}>{t("Languages")}</Link>
        </h3>
      </div>
      <div className={style.masterDetailContainer}>
        <div className={style.master}>
          <ClustersTable id={props.id} clusters={clusters} />
        </div>
        <div className={style.detail}>
          {props.action == "new" && <NewClusterForm history={props.history} />}
          {!!props.id && (
            <ClusterPageRouter
              key={props.id}
              id={props.id}
              basePath={props.basePath}
            />
          )}
        </div>
      </div>
    </div>
  );
}
