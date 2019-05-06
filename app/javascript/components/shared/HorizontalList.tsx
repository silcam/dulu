import React from "react";
import styles from "./HorizontalList.css";
import { Children } from "../../models/TypeBucket";

interface IProps {
  children: Children;
}

export default function(props: IProps) {
  return (
    <ul className={styles.hList} {...props}>
      {props.children}
    </ul>
  );
}
