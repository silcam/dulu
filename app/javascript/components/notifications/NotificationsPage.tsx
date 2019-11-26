import React, { useState, useEffect } from "react";
import styles from "../shared/MasterDetail.css";
import NotificationsList from "./NotificationsList";
import { INotification } from "./Notification";
import DuluAxios from "../../util/DuluAxios";
import { Channel } from "../dashboard/NotificationSidebar";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    DuluAxios.get("/api/notifications/global").then(
      notifications =>
        notifications && setNotifications(notifications.notifications)
    );
  }, []);

  return (
    <div className={styles.masterDetailContainer}>
      <div className={styles.master}>Filters</div>
      <div className={styles.detail}>
        <NotificationsList
          notifications={notifications}
          channel={Channel.all}
          getNotifications={() => {}}
          markAllRead={() => {}}
        />
      </div>
    </div>
  );
}
