import React from "react";
import style from "../shared/MasterDetail.css";
import RegionsTable from "./RegionsTable";
import AddIcon from "../shared/icons/AddIcon";
import FlexSpacer from "../shared/FlexSpacer";
import { Link } from "react-router-dom";
import NewRegionForm from "./NewRegionForm";
import { History } from "history";
import GoBar from "../shared/GoBar";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";
import useTranslation from "../../i18n/useTranslation";
import RegionPage from "./RegionPage";

interface IProps {
  id?: number;
  basePath: string;
  history: History;
  action: string;
}

export default function RegionsBoard(props: IProps) {
  const t = useTranslation();

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
          <RegionsTable id={props.id} regions={regions} />
        </div>
        <div className={style.detail}>
          {props.action == "new" && <NewRegionForm history={props.history} />}
          {props.id && (
            <RegionPage key={props.id} id={props.id} history={props.history} />
          )}
        </div>
      </div>
    </div>
  );
}
