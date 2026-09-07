import React from "react";
import style from "../shared/MasterDetail.css";
import RegionsTable from "./RegionsTable";
import AddIcon from "../shared/icons/AddIcon";
import FlexSpacer from "../shared/FlexSpacer";
import { Link, Outlet, useParams } from "react-router-dom";
import GoBar from "../shared/GoBar";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";
import useTranslation from "../../i18n/useTranslation";

export default function RegionsBoard() {
  const t = useTranslation();
  const { id } = useParams();

  const regions = useAppSelector(state => state.regions);
  const can = useAppSelector(state => state.can.regions);

  useLoadOnMount("/api/regions");

  return (
    <div className={style.container}>
      <div className={style.headerBar}>
        <h2>
          <Link to="/regions">{t("Regions")}</Link>
        </h2>
        {can.create && (
          <Link to="/regions/new">
            <AddIcon iconSize="large" />
          </Link>
        )}
        <GoBar />
        <FlexSpacer />
        <h3>
          <Link to="/clusters">{t("Clusters")}</Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to={"/languages"}>{t("Languages")}</Link>
        </h3>
      </div>
      <div className={style.masterDetailContainer}>
        <div className={style.master}>
          <RegionsTable
            id={id ? parseInt(id) : undefined}
            regions={regions}
          />
        </div>
        {/* Keyed so that switching regions remounts the detail pane, which is
            what `key={props.id}` on RegionPage used to do. Without it React
            reuses the instance and RegionPage's mount-time fetch never re-runs. */}
        <div className={style.detail} key={id}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
