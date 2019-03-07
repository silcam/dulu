import React from "react";
import styles from "./CheckboxInput.css";

interface IProps {
  name?: string;
  value: boolean;
  setValue: (v: boolean) => void;
  text: string;
}

export default function CheckBoxInput(props: IProps) {
  return (
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        name={props.name}
        checked={props.value}
        onChange={e => props.setValue(e.target.checked)}
      />
      &nbsp;
      {props.text}
    </label>
  );
}
