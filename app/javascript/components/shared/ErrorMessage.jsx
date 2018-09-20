import React from "react";
import PropTypes from "prop-types";
import AlertBox from "./AlertBox";

export default function ErrorMessage(props) {
  if (!props.message) return null;

  return <AlertBox message={props.message} styleClass="alertBoxRed" />;
}

ErrorMessage.propTypes = {
  message: PropTypes.string
};
