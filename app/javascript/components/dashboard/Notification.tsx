import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./NotificationsList.css";
import { AnyObj } from "../../models/TypeBucket";
import I18nContext from "../../contexts/I18nContext";
import commaJoinWithAnd from "../../util/commaJoinWithAnd";
import { T } from "../../i18n/i18n";

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

type Piece =
  | string
  | {
      href: string;
      text: string;
    };

export default function Notification(props: IProps) {
  const t = useContext(I18nContext);
  const pieces = arrayize(
    t(`notifications.${props.notification.message.key}`),
    props.notification.message.t_vars,
    props.notification.message.links,
    t
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
              typeof piece == "string" ? (
                piece
              ) : (
                <Link to={piece.href} key={index}>
                  {piece.text}
                </Link>
              )
            )}
          </span>
        </div>
      </td>
    </tr>
  );
}

function arrayize(text: string, vars: AnyObj, links: AnyObj, t: T): Piece[] {
  const pattern = /%{.+?}/g;
  let pieces = [];
  let match;
  let currentIndex = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > currentIndex)
      pieces.push(text.slice(currentIndex, match.index));
    pieces.push(...matchedPiece(match[0], vars, links, t));
    currentIndex = pattern.lastIndex;
  }
  if (currentIndex < text.length - 1) pieces.push(text.slice(currentIndex));
  return pieces;
}

function matchedPiece(
  match: string,
  vars: AnyObj,
  links: AnyObj,
  t: T
): Piece[] {
  const key = match.slice(2, -1); // Strip off %{}
  if (!vars[key]) return [match];
  if (typeof vars[key] == "string") {
    if (!links[key]) return [vars[key]];
    return [
      {
        href: links[key],
        text: vars[key]
      }
    ];
  } else {
    // vars[key] is an array
    if (!links[key]) return [commaJoinWithAnd(vars[key], t("and"))];
    const pieces: Piece[] = (vars[key] as string[]).map((text, i) => ({
      href: links[key][i],
      text: text
    }));
    let i = 1;
    while (i < pieces.length) {
      if (i == pieces.length - 1) pieces.splice(i, 0, ` ${t("and")} `);
      else pieces.splice(i, 0, ", ");
      i += 2;
    }
    return pieces;
  }
}
