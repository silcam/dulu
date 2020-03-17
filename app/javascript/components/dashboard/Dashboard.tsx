import React, { useState } from "react";
import Searcher from "./Searcher";
import NotificationSidebar from "./NotificationSidebar";
import styles from "./Dashboard.css";
import LanguageContainer from "../languages/LanguageContainer";
import useViewPrefs from "../../reducers/useViewPrefs";
import MainContent from "./MainContent";
import DashboardSidebar from "./DashboardSidebar";

export type Selection =
  | {
      type: "cameroon" | "user";
      id?: number; // never
    }
  | {
      type: "region" | "cluster" | "language";
      id: number;
    };

export default function Dashboard() {
  const { viewPrefs, setViewPrefs } = useViewPrefs();
  const selection = viewPrefs.dashboardSelection || { type: "user" };
  const [searcherActive, setSearcherActive] = useState(false);

  const setSelection = (selection: Selection) =>
    setViewPrefs({ dashboardSelection: selection });

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <DashboardSidebar selection={selection} setSelection={setSelection} />
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
            <MainContent selection={selection} />
          ))}
      </div>
      <div className={styles.notificationSidebar}>
        <NotificationSidebar />
      </div>
    </div>
  );
}
