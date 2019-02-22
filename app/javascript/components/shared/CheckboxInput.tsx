import React from "react";
import styles from "./CheckboxInput.css";
import { JSEventHandler } from "../../models/TypeBucket";

interface IProps {
  name?: string;
  value: boolean;
  handleCheck: JSEventHandler;
  text: string;
}

export default function CheckBoxInput(props: IProps) {
  return (
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        name={props.name}
        checked={props.value}
        onChange={props.handleCheck}
      />
      &nbsp;
      {props.text}
    </label>
  );
}
