import React from "react";
import styles from "./HorizontalList.css";

export default function(props) {
  return (
    <ul className={styles.hList} {...props}>
      {props.children}
    </ul>
  );
}
