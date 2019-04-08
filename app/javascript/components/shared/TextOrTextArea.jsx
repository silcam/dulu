import React from "react";
import PropTypes from "prop-types";
import { TextAreaGroup } from "./formGroup";

export default function TextOrTextArea(props) {
  return props.editing ? (
    <TextAreaGroup
      rows={props.rows}
      name={props.name}
      setValue={props.setValue}
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
  setValue: PropTypes.func.isRequired,
  rows: PropTypes.number,
  // optional
  label: PropTypes.string,
  name: PropTypes.string
};
