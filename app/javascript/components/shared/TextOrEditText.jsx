import React from "react";
import PropTypes from "prop-types";
import { ValidatedTextInputGroup } from "../shared/formGroup";

export default function TextOrEditText(props) {
  const { editing, ...otherProps } = props;
  return editing ? (
    <ValidatedTextInputGroup {...otherProps} />
  ) : (
    <span>{props.value}</span>
  );
}

TextOrEditText.propTypes = {
  editing: PropTypes.bool,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  // optional
  t: PropTypes.func, // required for validation
  label: PropTypes.string, // only displayed in edit mode
  validateNotBlank: PropTypes.bool,
  name: PropTypes.string
};
