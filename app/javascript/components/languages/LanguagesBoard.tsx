import React from "react";
import styles from "../shared/MasterDetail.css";
import { Link } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import LanguagesTable from "./LanguagesTable";
import FlexSpacer from "../shared/FlexSpacer";
import GoBar from "../shared/GoBar";
import { Location, History } from "history";
import LanguagePageRouter from "./LanguagePageRouter";
import { useLoadOnMount } from "../shared/useLoad";
import useTranslation from "../../i18n/useTranslation";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  action?: string;
  id?: number;
  basePath: string;
  location: Location;
  history: History;
}

export default function LanguagesBoard(props: IProps) {
  const t = useTranslation();

  const languages = useAppSelector(state => state.languages);
  const can = useAppSelector(state => state.can.languages);

  useLoadOnMount("/api/languages");

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h2>
          <Link to="/languages">{t("Languages")}</Link>
        </h2>
        {can.create && (
          <Link to="/languages/new">
            <AddIcon iconSize="large" />
          </Link>
        )}
        <GoBar />
        <FlexSpacer />
        <h3>
          <Link to="/regions">{t("Regions")}</Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/clusters">{t("Clusters")}</Link>
        </h3>
      </div>
      <div className={styles.masterDetailContainer}>
        <div className={styles.master}>
          <LanguagesTable id={props.id} languages={languages} />
        </div>
        <div className={styles.detail}>
          {/* {props.action == "new" && (
              <NewLanguageForm
                t={props.t}
                saving={props.savingNew}
                addLanguage={addLanguage}
              />
            )} */}
          {props.id && (
            <LanguagePageRouter
              key={props.id + location.pathname}
              id={props.id}
              basePath={props.basePath}
            />
          )}
        </div>
      </div>
    </div>
  );
}
