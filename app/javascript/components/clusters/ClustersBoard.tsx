import React from "react";
import ClustersTable from "./ClustersTable";
import style from "../shared/MasterDetail.css";
import FlexSpacer from "../shared/FlexSpacer";
import { Link, Outlet, useParams } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import GoBar from "../shared/GoBar";
import useTranslation from "../../i18n/useTranslation";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

export default function ClustersBoard() {
  const t = useTranslation();
  const { id } = useParams();

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
          <ClustersTable
            id={id ? parseInt(id) : undefined}
            clusters={clusters}
          />
        </div>
        {/* Keyed so switching clusters remounts the detail, as the old
            `key={props.id}` on ClusterPageRouter did. */}
        <div className={style.detail} key={id}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
