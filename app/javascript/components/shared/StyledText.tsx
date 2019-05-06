import React from "react";
import styles from "./StyledText.css";
import { Children } from "../../models/TypeBucket";

interface IProps {
  styleClass: string;
  children: Children;
}

export default function StyledText(props: IProps) {
  const { styleClass, children, ...otherProps } = props;
  return (
    <span className={styles[styleClass]} {...otherProps}>
      {children}
    </span>
  );
}
