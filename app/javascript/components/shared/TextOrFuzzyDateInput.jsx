import React from "react";
import PropTypes from "prop-types";
import FuzzyDateInput from "./FuzzyDateInput";

export default function TextOrFuzzyDateInput(props) {
  return props.editing ? (
    <FuzzyDateInput {...props} />
  ) : (
    <span>{props.date}</span>
  );
}

TextOrFuzzyDateInput.propTypes = {
  editing: PropTypes.bool,
  date: PropTypes.string.isRequired
};
