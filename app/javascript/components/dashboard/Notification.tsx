import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./NotificationsList.css";
import { AnyObj } from "../../models/TypeBucket";
import I18nContext from "../../application/I18nContext";

export interface INotification {
  id: number;
  message: {
    key: string;
    t_vars: AnyObj;
    links: AnyObj;
  };
  created_at: string;
  read?: boolean;
}

interface IProps {
  notification: INotification;
}

export default function Notification(props: IProps) {
  const t = useContext(I18nContext);
  const pieces = arrayize(
    t(`notifications.${props.notification.message.key}`),
    props.notification.message.t_vars,
    props.notification.message.links
  );
  return (
    <tr>
      <td>
        <span className={styles.notificationDate}>
          {props.notification.created_at.slice(0, 10)}
        </span>
        <br />
        <div className={styles.notificationText}>
          <span
            className={props.notification.read ? "" : styles.unreadNotification}
          >
            {pieces.map((piece, index) =>
              piece.href ? (
                <Link to={piece.href} key={index}>
                  {piece.text}
                </Link>
              ) : (
                piece
              )
            )}
          </span>
        </div>
      </td>
    </tr>
  );
}

function arrayize(text: string, vars: AnyObj, links: AnyObj) {
  const pattern = /%{.+?}/g;
  let pieces = [];
  let match;
  let currentIndex = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > currentIndex)
      pieces.push(text.slice(currentIndex, match.index));
    pieces.push(matchedPiece(match[0], vars, links));
    currentIndex = pattern.lastIndex;
  }
  if (currentIndex < text.length - 1) pieces.push(text.slice(currentIndex));
  return pieces;
}

function matchedPiece(match: string, vars: AnyObj, links: AnyObj) {
  const key = match.slice(2, -1); // Strip off %{}
  if (!vars[key]) return match;
  if (!links[key]) return vars[key];
  return {
    href: links[key],
    text: vars[key]
  };
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};
