import React, { useState } from "react";
import Searcher from "./Searcher";
import NotificationSidebar from "./NotificationSidebar";
import styles from "./Dashboard.css";
import DashboardSidebarContainer from "./DashboardSidebarContainer";
import { User, ViewPrefs, UpdateViewPrefs } from "../../application/DuluApp";
import MainContentContainer from "./MainContentContainer";

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
  viewPrefs: ViewPrefs;
  updateViewPrefs: UpdateViewPrefs;
}

export default function Dashboard(props: IProps) {
  const selection = props.viewPrefs.dashboardSelection || { type: "user" };
  const [searcherActive, setSearcherActive] = useState(false);

  const setSelection = (selection: Selection) =>
    props.updateViewPrefs({ dashboardSelection: selection });

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
        {!searcherActive && (
          <MainContentContainer
            selection={selection}
            userId={props.user.id}
            viewPrefs={props.viewPrefs}
            updateViewPrefs={props.updateViewPrefs}
          />
        )}
      </div>
      <div className={styles.notificationSidebar}>
        <NotificationSidebar
          viewPrefs={props.viewPrefs}
          updateViewPrefs={props.updateViewPrefs}
        />
      </div>
    </div>
  );
}
