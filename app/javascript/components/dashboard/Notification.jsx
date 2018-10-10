import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./NotificationsList.css";

export default function Notification(props) {
  const pieces = arrayize(
    props.t(`notifications.${props.notification.message.key}`),
    props.notification.message.t_vars,
    props.notification.message.links
  );
  return (
    <tr>
      <td>
        <span className="notificationDate">
          {props.notification.created_at.slice(0, 10)}
        </span>
        <br />
        <span
          className={props.notification.read ? "" : styles.unreadNotification}
        >
          {pieces.map(
            (piece, index) =>
              piece.href ? (
                <Link to={piece.href} key={index}>
                  {piece.text}
                </Link>
              ) : (
                piece
              )
          )}
        </span>
      </td>
    </tr>
  );
}

function arrayize(text, vars, links) {
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

function matchedPiece(match, vars, links) {
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
