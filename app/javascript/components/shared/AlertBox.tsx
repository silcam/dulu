import React from "react";
import * as styles from "./AlertBox.css";

type StyleClasses = "alertBox" | "alertBoxRed";

interface IProps {
  text?: string;
  styleClass?: StyleClasses;
  children: any;
}

export default function AlertBox(props: IProps) {
  const styleClass = props.styleClass ? props.styleClass : "alertBox";
  const contents = props.text || props.children;
  return <div className={styles[styleClass]}>{contents}</div>;
}
