import React from "react";
import PropTypes from "prop-types";
import { ValidatedTextInputGroup } from "../shared/formGroup";

export default function TextOrEditText(props) {
  const { editing, updateValue, ...otherProps } = props;
  return editing ? (
    <ValidatedTextInputGroup
      handleInput={e => updateValue(e.target.value)}
      {...otherProps}
    />
  ) : (
    <span>{props.value}</span>
  );
}

TextOrEditText.propTypes = {
  editing: PropTypes.bool,
  value: PropTypes.string.isRequired,
  updateValue: PropTypes.func.isRequired,
  // optional
  t: PropTypes.func, // required for validation
  label: PropTypes.string, // only displayed in edit mode
  validateNotBlank: PropTypes.bool,
  name: PropTypes.string
};
