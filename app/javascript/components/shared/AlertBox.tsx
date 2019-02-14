import React from "react";
import * as styles from "./AlertBox.css";

interface IProps {
  text?: string;
  styleClass?: string;
  children: any;
}

export default function AlertBox(props: IProps) {
  const styleClass = props.styleClass || "alertBox";
  const contents = props.text || props.children;
  return <p className={styles[styleClass]}>{contents}</p>;
}
