import React from "react";
import PropTypes from "prop-types";
import styles from "./Icon.css";
import update from "immutability-helper";

export default function Icon(props) {
  let { iconSize, styleClass, children, svgStyle, ...otherProps } = props;
  svgStyle = update(iconSizer(iconSize), { $merge: svgStyle || {} });

  return (
    <span className={styles[styleClass]} {...otherProps}>
      <svg
        style={svgStyle}
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

Icon.propTypes = {
  iconSize: PropTypes.string,
  styleClass: PropTypes.string,
  svgStyle: PropTypes.object
};
