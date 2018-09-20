import React from "react";
import PropTypes from "prop-types";
import styles from "./AlertBox.css";

export default function AlertBox(props) {
  const styleClass = props.styleClass || "alertBox";
  return <p className={styles[styleClass]}>{props.text}</p>;
}

AlertBox.propTypes = {
  text: PropTypes.string.isRequired,
  styleClass: PropTypes.string
};
