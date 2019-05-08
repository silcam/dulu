import React, { useEffect, useContext } from "react";
import { IRegion } from "../../models/Region";
import style from "../shared/MasterDetail.css";
import RegionsTable from "./RegionsTable";
import AddIcon from "../shared/icons/AddIcon";
import FlexSpacer from "../shared/FlexSpacer";
import { Link } from "react-router-dom";
import NewRegionForm from "./NewRegionForm";
import RegionContainer from "./RegionContainer";
import { Adder, Setter, SetCan } from "../../models/TypeBucket";
import API from "./RegionsAPI";
import { IPerson } from "../../models/Person";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import { History } from "history";
import I18nContext from "../../contexts/I18nContext";
import { ICan } from "../../actions/canActions";
import GoBar from "../shared/GoBar";

interface IProps {
  id?: number;
  basePath: string;
  history: History;
  action: string;
  regions: IRegion[];
  setRegions: Adder<IRegion>;
  addPeople: Adder<IPerson>;
  addClusters: Adder<ICluster>;
  addLanguages: Adder<ILanguage>;
  setRegion: Setter<IRegion>;
  can: ICan;
  setCan: SetCan;
}

export default function RegionsBoard(props: IProps) {
  const t = useContext(I18nContext);

  useEffect(() => {
    API.fetchAll(props.setRegions, props.setCan);
  }, []);

  return (
    <div className={style.container}>
      <div className={style.headerBar}>
        <h2>
          <Link to="/regions">{t("Regions")}</Link>
        </h2>
        {props.can.create && (
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
          <RegionsTable id={props.id} regions={props.regions} />
        </div>
        <div className={style.detail}>
          {props.action == "new" && (
            <NewRegionForm
              setRegion={props.setRegion}
              addPeople={props.addPeople}
              addClusters={props.addClusters}
              addLanguages={props.addLanguages}
              history={props.history}
            />
          )}
          {props.id && (
            <RegionContainer
              key={props.id}
              id={props.id}
              history={props.history}
            />
          )}
        </div>
      </div>
    </div>
  );
}
