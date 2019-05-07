import React from "react";
import styles from "./StyledTable.css";
import { Children } from "../../models/TypeBucket";

enum StyleClass {
  normal = "normal"
}

interface IProps {
  styleClass?: StyleClass;
  children: Children;
}

export default function StyledTable(props: IProps) {
  let { styleClass, ...otherProps } = props;
  if (!styleClass || !Object.keys(StyleClass).includes(styleClass))
    styleClass = StyleClass.normal;

  return (
    <table className={styles[styleClass]} {...otherProps}>
      {props.children}
    </table>
  );
}
