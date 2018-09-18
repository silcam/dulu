import React from "react";
import styles from "./StyledLink.css";

export default function StyledLink(props) {
  let { styleClass, children, ...otherProps } = props;
  return (
    <span className={styles[styleClass]} {...otherProps}>
      {children}
    </span>
  );
}
