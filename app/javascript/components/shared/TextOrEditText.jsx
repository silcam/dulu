import React from "react";
import PropTypes from "prop-types";
import { ValidatedTextInputGroup } from "../shared/formGroup";

export default function TextOrEditText(props) {
  return props.editing ? (
    <ValidatedTextInputGroup
      label={props.label}
      value={props.value}
      handleInput={e => props.updateValue(e.target.value)}
      t={props.t}
      validateNotBlank={props.validateNotBlank}
    />
  ) : (
    <span>{props.value}</span>
  );
}

TextOrEditText.propTypes = {
  editing: PropTypes.bool,
  value: PropTypes.string,
  updateValue: PropTypes.func.isRequired,
  // optional
  t: PropTypes.func, // required for validation
  label: PropTypes.string, // only displayed in edit mode
  validateNotBlank: PropTypes.bool
};
