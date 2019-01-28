import React from "react";
import PropTypes from "prop-types";

export default function DaySelector(props) {
  const name = props.name || "day";
  const maxValue = props.maxValue || 31;

  if (props.value > props.maxValue)
    props.handleInput({ target: { name: name, value: props.maxValue } });

  var optionsArray = [];
  for (var day = 1; day <= maxValue; ++day) {
    optionsArray.push(
      <option key={day} value={day}>
        {day}
      </option>
    );
  }
  return (
    <select
      className="form-control"
      name={name}
      value={String(props.value)}
      onChange={props.handleInput}
    >
      <option value="">{props.t("Day")}</option>
      {optionsArray}
    </select>
  );
}

DaySelector.propTypes = {
  handleInput: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxValue: PropTypes.number,
  name: PropTypes.string
};
