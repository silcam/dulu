import React from "react";
import styles from "./formGroup.css";
import { Children } from "../../models/TypeBucket";

interface IProps {
  label?: string;
  children: Children;
}

export default function FormGroup(props: IProps) {
  return (
    <div className={styles.formGroup}>
      <label>
        {props.label || ""}
        <div>{props.children}</div>
      </label>
    </div>
  );
}
