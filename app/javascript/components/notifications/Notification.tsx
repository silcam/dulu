import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotificationsList.css";

export interface INotification {
  id: number;
  text: string;
  created_at: string;
  person_notification?: {
    id: number;
    read?: boolean;
  };
}

interface IProps {
  notification: INotification;
}

export default function Notification(props: IProps) {
  return (
    <tr>
      <td>
        <span className={styles.notificationDate}>
          {props.notification.created_at.slice(0, 10)}
        </span>
        <br />
        <div className={styles.notificationText}>
          <span
            className={
              props.notification.person_notification &&
              !props.notification.person_notification.read
                ? styles.unreadNotification
                : ""
            }
          >
            {props.notification.text
              .split(/(\[.+?\]\(.+?\))/g)
              .map((piece, index) =>
                index % 2 === 0 ? (
                  piece
                ) : (
                  <Link to={/\((.+?)\)$/.exec(piece)![1]}>
                    {/^\[(.+?)\]/.exec(piece)![1]}
                  </Link>
                )
              )}
          </span>
        </div>
      </td>
    </tr>
  );
}
