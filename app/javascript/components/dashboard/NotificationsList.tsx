import React, { useContext } from "react";
import styles from "./NotificationsList.css";
import Notification, { INotification } from "./Notification";
import { Channel } from "./NotificationSidebar";
import I18nContext from "../../application/I18nContext";

interface IProps {
  channel: Channel;
  notifications: INotification[];
  unreadNotifications?: boolean;
  loading?: boolean;
  moreAvailable?: boolean;
  getNotifications: (c: Channel) => void;
  markAllRead: (c: Channel) => void;
}

export default function NotificationsList(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <div className={styles.notificationsListContainer}>
      {props.unreadNotifications && (
        <button
          className="link"
          onClick={() => props.markAllRead(props.channel)}
        >
          {t("Mark_all_read")}
        </button>
      )}
      <table className={styles.notificationsList}>
        <tbody>
          {props.notifications.map(notification => {
            return (
              <Notification
                key={notification.id}
                notification={notification}
                t={t}
              />
            );
          })}
          <tr>
            <td>
              {props.moreAvailable && !props.loading && (
                <button
                  className="link"
                  onClick={() => {
                    props.getNotifications(props.channel);
                  }}
                  style={{ padding: 0 }}
                >
                  {t("See_more")}
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
