import React from "react";
import PropTypes from "prop-types";

import styles from "./StyledButton.css";

const styleClasses = ["link"];

export default function StyledButton(props) {
  let { styleClass, ...otherProps } = props;
  if (!styleClasses.includes(styleClass)) styleClass = "link";

  return (
    <button className={styles[styleClass]} {...otherProps}>
      {props.children}
    </button>
  );
}

StyledButton.propTypes = {
  styleClass: PropTypes.oneOf(["link"])
};
