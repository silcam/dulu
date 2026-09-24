import React, { useContext } from "react";
import styles from "../shared/MasterDetail.css";
import PeopleTable from "./PeopleTable";
import AddIcon from "../shared/icons/AddIcon";
import { Link, Outlet, useParams } from "react-router-dom";
import FlexSpacer from "../shared/FlexSpacer";
import GoBar from "../shared/GoBar";
import I18nContext from "../../contexts/I18nContext";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

export default function PeopleBoard() {
  const t = useContext(I18nContext);
  const { id } = useParams();
  const people = useAppSelector(state => state.people);
  const can = useAppSelector(state => state.can.people);

  useLoadOnMount("/api/people");

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h2>
          <Link to="/people">{t("People")}</Link>
        </h2>
        {can.create && (
          <Link to="/people/new">
            <AddIcon iconSize="large" />
          </Link>
        )}
        <GoBar />
        <FlexSpacer />
        <h3>
          <Link to="/organizations">{t("Organizations")}</Link>
        </h3>
      </div>
      <div className={styles.masterDetailContainer}>
        <div className={styles.master}>
          <PeopleTable id={id ? parseInt(id) : undefined} people={people} />
        </div>
        <div className={styles.detail} key={id}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
