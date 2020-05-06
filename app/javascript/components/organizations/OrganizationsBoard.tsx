import React from "react";
import styles from "../shared/MasterDetail.css";
import OrganizationsTable from "./OrganizationsTable";
import NewOrganizationForm from "./NewOrganizationForm";
import { Link } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import FlexSpacer from "../shared/FlexSpacer";
import GoBar from "../shared/GoBar";
import { History } from "history";
import OrganizationPage from "./OrganizationPage";
import useTranslation from "../../i18n/useTranslation";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  id?: number;
  action?: string;
  history: History;
}

export default function OrganizationsBoard(props: IProps) {
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
          <OrganizationsTable id={props.id} organizations={organizations} />
        </div>
        <div className={styles.detail}>
          {props.action == "new" && (
            <NewOrganizationForm history={props.history} />
          )}
          {props.action == "show" && (
            <OrganizationPage
              key={props.id}
              id={props.id!}
              history={props.history}
            />
          )}
          {!props.action && <span />}
        </div>
      </div>
    </div>
  );
}
