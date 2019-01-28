import React from "react";
import PropTypes from "prop-types";

export default function Spacer(props) {
  return <span style={{ display: "inline-block", width: props.width }} />;
}

Spacer.propTypes = {
  width: PropTypes.string.isRequired
};
