import React from "react";
import styles from "./StyledTable.css";
import { Children } from "../../models/TypeBucket";

export enum TableStyleClass {
  normal = "normal",
  noBorder = "noBorder"
}

interface IProps {
  styleClass?: TableStyleClass;
  children: Children;
}

export default function StyledTable(props: IProps) {
  let { styleClass, ...otherProps } = props;
  if (!styleClass || !Object.keys(TableStyleClass).includes(styleClass))
    styleClass = TableStyleClass.normal;

  return (
    <table className={styles[styleClass]} {...otherProps}>
      {props.children}
    </table>
  );
}
