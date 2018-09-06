import React from "react";
import styles from "./StyledTable.css";

const styleClasses = ["normal"];

export default function(props) {
  let { styleClass, ...otherProps } = props;
  if (!styleClasses.includes(styleClass)) styleClass = "normal";

  return (
    <table className={styles[styleClass]} {...otherProps}>
      {props.children}
    </table>
  );
}
