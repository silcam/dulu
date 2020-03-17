import React, { useContext } from "react";
import styles from "../shared/MasterDetail.css";
import PeopleTable from "./PeopleTable";
import AddIcon from "../shared/icons/AddIcon";
import { Link } from "react-router-dom";
import FlexSpacer from "../shared/FlexSpacer";
import GoBar from "../shared/GoBar";
import { History } from "history";
import I18nContext from "../../contexts/I18nContext";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";
import PeopleRouter from "./PeopleRouter";

interface IProps {
  id?: number;
  history: History;
}

export default function PeopleBoard(props: IProps) {
  const t = useContext(I18nContext);
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
          <PeopleTable id={props.id} people={people} />
        </div>
        <div className={styles.detail}>
          <PeopleRouter />
        </div>
      </div>
    </div>
  );
}
