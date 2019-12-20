import React, { useState, useContext } from "react";
import Searcher from "./Searcher";
import NotificationSidebar from "./NotificationSidebar";
import styles from "./Dashboard.css";
import DashboardSidebarContainer from "./DashboardSidebarContainer";
import { User } from "../../application/DuluApp";
import MainContentContainer from "./MainContentContainer";
import ViewPrefsContext from "../../contexts/ViewPrefsContext";
import LanguageContainer from "../languages/LanguageContainer";

export type Selection =
  | {
      type: "cameroon" | "user";
      id?: number; // never
    }
  | {
      type: "region" | "cluster" | "language";
      id: number;
    };

interface IProps {
  user: User;
}

export default function Dashboard(props: IProps) {
  const { viewPrefs, updateViewPrefs } = useContext(ViewPrefsContext);
  const selection = viewPrefs.dashboardSelection || { type: "user" };
  const [searcherActive, setSearcherActive] = useState(false);

  const setSelection = (selection: Selection) =>
    updateViewPrefs({ dashboardSelection: selection });

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <DashboardSidebarContainer
          user={props.user}
          selection={selection}
          setSelection={setSelection}
        />
      </div>
      <div className={styles.mainContent}>
        <Searcher setSeacherActive={setSearcherActive} />
        {!searcherActive &&
          (selection.type == "language" ? (
            <LanguageContainer
              basePath=""
              id={selection.id}
              key={selection.id}
            />
          ) : (
            <MainContentContainer
              selection={selection}
              userId={props.user.id}
            />
          ))}
      </div>
      <div className={styles.notificationSidebar}>
        <NotificationSidebar />
      </div>
    </div>
  );
}
