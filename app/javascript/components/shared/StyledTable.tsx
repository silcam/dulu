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
  const { styleClass: propsStyleClass, ...otherProps } = props;
  const styleClass =
    propsStyleClass && Object.keys(TableStyleClass).includes(propsStyleClass)
      ? propsStyleClass
      : TableStyleClass.normal;

  return (
    <table className={styles[styleClass]} {...otherProps}>
      {props.children}
    </table>
  );
}
