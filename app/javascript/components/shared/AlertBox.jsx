import React from "react";
import PropTypes from "prop-types";
import styles from "./AlertBox.css";

export default function AlertBox(props) {
  const styleClass = props.styleClass || "alertBox";
  const contents = props.text || props.children;
  return <p className={styles[styleClass]}>{contents}</p>;
}

AlertBox.propTypes = {
  text: PropTypes.string,
  styleClass: PropTypes.string
};
