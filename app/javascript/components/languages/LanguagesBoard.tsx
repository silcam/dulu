import React from "react";
import styles from "../shared/MasterDetail.css";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import LanguagesTable from "./LanguagesTable";
import FlexSpacer from "../shared/FlexSpacer";
import GoBar from "../shared/GoBar";
import { useLoadOnMount } from "../shared/useLoad";
import useTranslation from "../../i18n/useTranslation";
import useAppSelector from "../../reducers/useAppSelector";

export default function LanguagesBoard() {
  const t = useTranslation();
  const { id } = useParams();
  const location = useLocation();

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
          <LanguagesTable
            id={id ? parseInt(id) : undefined}
            languages={languages}
          />
        </div>
        {/* Keyed on the full pathname, which is what the old
            `key={props.id + location.pathname}` on LanguagePageRouter did:
            every navigation within a language remounts the detail pane. */}
        <div className={styles.detail} key={location.pathname}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
