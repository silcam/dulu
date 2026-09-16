import React from "react";
import {
  IDomainStatusItem,
  lingCompleteSat
} from "../../models/DomainStatusItem";
import styles from "./DomainStatus.css";

export default function DSLingCompleteStyler(props: {
  children: React.ReactNode;
  item: IDomainStatusItem;
}) {
  return (
    <span className={lingCompleteSat(props.item) ? "" : styles.incomplete}>
      {props.children}
    </span>
  );
}
