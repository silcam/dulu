import React from "react";
import PropTypes from "prop-types";

export default function YearInput(props) {
  const name = props.name || "year";
  return (
    <input
      type="text"
      name={name}
      value={props.value}
      size="4"
      maxLength="4"
      placeholder={props.t("Year")}
      onChange={props.handleInput}
      className="form-control"
    />
  );
}

YearInput.propTypes = {
  handleInput: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  value: PropTypes.string
};
