import React, { useEffect, useState } from "react";
import { IRegion } from "../../models/Region";
import style from "../shared/MasterDetail.css";
import RegionsTable from "./RegionsTable";
import AddIcon from "../shared/icons/AddIcon";
import FlexSpacer from "../shared/FlexSpacer";
import { Link } from "react-router-dom";
import NewRegionForm from "./NewRegionForm";
import RegionContainer from "./RegionContainer";
import { T } from "../../i18n/i18n";
import { Adder, Setter } from "../../models/TypeBucket";
import API from "./RegionsAPI";
import { Person } from "../../models/Person";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/language";
import { History } from "history";

interface IProps {
  t: T;
  id?: number;
  basePath: string;
  history: History;
  action: string;
  regions: IRegion[];
  setRegions: Adder<IRegion>;
  addPeople: Adder<Person>;
  addClusters: Adder<ICluster>;
  addLanguages: Adder<ILanguage>;
  setRegion: Setter<IRegion>;
}

interface ICan {
  create?: boolean;
}

export default function RegionsBoard(props: IProps) {
  const t = props.t;
  const [can, setCan] = useState<ICan>({});

  useEffect(() => {
    API.fetchAll(props.setRegions, setCan);
  }, []);

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
        <FlexSpacer />
        <h3>
          <Link to="/clusters">{t("Clusters")}</Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to={"/languages"}>{t("Languages")}</Link>
        </h3>
      </div>
      <div className={style.masterDetailContainer}>
        <div className={style.master}>
          <RegionsTable t={t} id={props.id} regions={props.regions} />
        </div>
        <div className={style.detail}>
          {props.action == "new" && (
            <NewRegionForm
              t={t}
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
              t={t}
              history={props.history}
            />
          )}
        </div>
      </div>
    </div>
  );
}
