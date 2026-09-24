import React from "react";
import styles from "../shared/MasterDetail.css";
import OrganizationsTable from "./OrganizationsTable";
import { Link, Outlet, useParams } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import FlexSpacer from "../shared/FlexSpacer";
import GoBar from "../shared/GoBar";
import useTranslation from "../../i18n/useTranslation";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

export default function OrganizationsBoard() {
  const { id } = useParams();
  const t = useTranslation();
  useLoadOnMount("/api/organizations");

  const organizations = useAppSelector(state => state.organizations);
  const can = useAppSelector(state => state.can.organizations);

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h2>
          <Link to="/organizations">{t("Organizations")}</Link>
        </h2>
        {can.create && (
          <Link to="/organizations/new">
            <AddIcon iconSize="large" />
          </Link>
        )}
        <GoBar />
        <FlexSpacer />
        <h3>
          <Link to="/people">{t("People")}</Link>
        </h3>
      </div>
      <div className={styles.masterDetailContainer}>
        <div className={styles.master}>
          <OrganizationsTable
            id={id ? parseInt(id) : undefined}
            organizations={organizations}
          />
        </div>
        <div className={styles.detail} key={id}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
