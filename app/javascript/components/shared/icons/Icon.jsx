import React from "react";
import styles from "./Icon.css";

export default function Icon(props) {
  const { iconSize, styleClass, children, ...otherProps } = props;
  return (
    <span className={styles[styleClass]} {...otherProps}>
      <svg
        style={iconSizer(iconSize)}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        {children}
      </svg>
    </span>
  );
}

function iconSizer(size) {
  switch (size) {
    case "large":
      return { width: "32px", height: "32px" };
    case "small":
      return { width: "16px", height: "16px" };
  }
  return {};
}
