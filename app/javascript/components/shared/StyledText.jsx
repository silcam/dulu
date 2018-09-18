import React from "react";
import styles from "./StyledText.css";

export default function StyledText(props) {
  const { styleClass, children, ...otherProps } = props;
  return (
    <span className={styles[styleClass]} {...otherProps}>
      {children}
    </span>
  );
}
