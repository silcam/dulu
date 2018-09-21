import React from "react";
import PropTypes from "prop-types";

export default function TextOrTextArea(props) {
  return props.editing ? (
    <textarea
      rows={props.rows || 4}
      onChange={e => props.updateValue(e.target.value)}
      value={props.value || ""}
    />
  ) : (
    <span>{props.value}</span>
  );
}

TextOrTextArea.propTypes = {
  editing: PropTypes.bool,
  value: PropTypes.string,
  updateValue: PropTypes.func.isRequired,
  rows: PropTypes.number
};
