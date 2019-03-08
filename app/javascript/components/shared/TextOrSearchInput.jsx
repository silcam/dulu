import React from "react";
import PropTypes from "prop-types";
import SearchTextInput from "./SearchTextInput";

export default function TextOrSearchInput(props) {
  return props.editing ? (
    <SearchTextInput {...props} />
  ) : (
    <span>{props.text}</span>
  );
}

TextOrSearchInput.propTypes = {
  editing: PropTypes.bool,
  text: PropTypes.string,
  updateValue: PropTypes.func.isRequired,
  queryPath: PropTypes.string.isRequired
};
