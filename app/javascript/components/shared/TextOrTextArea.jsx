import React from "react";
import PropTypes from "prop-types";
import { TextAreaGroup } from "./formGroup";

export default function TextOrTextArea(props) {
  return props.editing ? (
    <TextAreaGroup
      rows={props.rows}
      name={props.name}
      handleInput={e => props.updateValue(e.target.value)}
      value={props.value}
      label={props.label}
    />
  ) : (
    <span>{props.value}</span>
  );
}

TextOrTextArea.propTypes = {
  editing: PropTypes.bool,
  value: PropTypes.string,
  updateValue: PropTypes.func.isRequired,
  rows: PropTypes.number,
  // optional
  label: PropTypes.string
};
